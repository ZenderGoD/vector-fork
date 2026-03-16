'use client';

import { useMemo, useState } from 'react';
import { FunctionReturnType } from 'convex/server';
import { Check, Plus, Tag } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { useOptimisticValue } from '@/hooks/use-optimistic';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAccess } from '@/components/ui/permission-aware';
import { cn } from '@/lib/utils';

export type IssueLabel = FunctionReturnType<
  typeof api.organizations.queries.listIssueLabels
>[number];

type SelectorDisplayMode =
  | 'default'
  | 'labelOnly'
  | 'iconOnly'
  | 'iconWhenUnselected';

function resolveVisibility(
  mode: SelectorDisplayMode | undefined,
  hasSelection: boolean,
) {
  switch (mode) {
    case 'labelOnly':
      return { showIcon: false, showLabel: true };
    case 'iconOnly':
      return { showIcon: true, showLabel: false };
    case 'iconWhenUnselected':
      return { showIcon: true, showLabel: hasSelection };
    case 'default':
    default:
      return { showIcon: true, showLabel: true };
  }
}

function serializeLabelIds(labelIds: readonly string[]) {
  return [...new Set(labelIds)].sort().join('|');
}

function deserializeLabelIds(value: string) {
  if (!value) return [];
  return value.split('|').filter(Boolean);
}

function normalizeLabelName(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function IssueLabelBadge({
  label,
  className,
}: {
  label: { _id: string; name: string; color?: string };
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center gap-1 rounded-md border px-1.5 text-xs font-medium',
        className,
      )}
      style={{
        borderColor: `${label.color ?? '#94a3b8'}33`,
        backgroundColor: `${label.color ?? '#94a3b8'}12`,
      }}
    >
      <span
        className='size-1.5 rounded-full'
        style={{ backgroundColor: label.color ?? '#94a3b8' }}
      />
      <span className='truncate'>{label.name}</span>
    </span>
  );
}

interface IssueLabelSelectorProps {
  labels: readonly IssueLabel[];
  selectedLabelIds: readonly string[];
  onSelectionChange: (labelIds: string[]) => void;
  onCreateLabel?: (
    name: string,
  ) => Promise<Pick<IssueLabel, '_id' | 'name' | 'color'> | null>;
  displayMode?: SelectorDisplayMode;
  trigger?: React.ReactElement;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export function IssueLabelSelector({
  labels,
  selectedLabelIds,
  onSelectionChange,
  onCreateLabel,
  displayMode,
  trigger,
  className,
  align = 'start',
}: IssueLabelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdLabels, setCreatedLabels] = useState<IssueLabel[]>([]);
  const { viewOnly } = useAccess();

  const [displaySerializedLabelIds, setOptimisticLabelIds] = useOptimisticValue(
    serializeLabelIds(selectedLabelIds),
  );
  const displayLabelIds = deserializeLabelIds(displaySerializedLabelIds);

  const allLabels = useMemo(() => {
    const deduped = new Map<string, IssueLabel>();
    [...labels, ...createdLabels].forEach(label => {
      deduped.set(String(label._id), label);
    });
    return Array.from(deduped.values()).sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  }, [createdLabels, labels]);

  const selectedLabels = useMemo(
    () =>
      allLabels.filter(label => displayLabelIds.includes(String(label._id))),
    [allLabels, displayLabelIds],
  );

  const normalizedSearch = normalizeLabelName(search);
  const hasExactMatch = allLabels.some(
    label => label.name.trim().toLowerCase() === normalizedSearch.toLowerCase(),
  );

  const toggleLabel = (labelId: string) => {
    const nextLabelIds = displayLabelIds.includes(labelId)
      ? displayLabelIds.filter(id => id !== labelId)
      : [...displayLabelIds, labelId];

    setOptimisticLabelIds(serializeLabelIds(nextLabelIds));
    onSelectionChange(nextLabelIds);
  };

  const handleCreateLabel = async () => {
    if (!onCreateLabel || !normalizedSearch || isCreating) return;

    setIsCreating(true);
    try {
      const createdLabel = await onCreateLabel(normalizedSearch);
      if (!createdLabel) return;

      const nextCreatedLabel: IssueLabel = {
        _id: createdLabel._id as IssueLabel['_id'],
        _creationTime: Date.now(),
        organizationId: '' as IssueLabel['organizationId'],
        name: createdLabel.name,
        color: createdLabel.color,
      };
      setCreatedLabels(current => [
        ...current.filter(
          label => String(label._id) !== String(createdLabel._id),
        ),
        nextCreatedLabel,
      ]);

      const nextLabelIds = Array.from(
        new Set([...displayLabelIds, String(createdLabel._id)]),
      );
      setOptimisticLabelIds(serializeLabelIds(nextLabelIds));
      onSelectionChange(nextLabelIds);
      setSearch('');
    } finally {
      setIsCreating(false);
    }
  };

  const summary =
    selectedLabels.length === 0
      ? 'Labels'
      : selectedLabels.length === 1
        ? selectedLabels[0].name
        : `${selectedLabels[0].name} +${selectedLabels.length - 1}`;

  const hasSelection = selectedLabels.length > 0;
  const { showIcon, showLabel } = resolveVisibility(displayMode, hasSelection);

  const defaultTrigger = (
    <Button
      variant='outline'
      size='sm'
      className={cn('bg-muted/30 hover:bg-muted/50 h-8 gap-2', className)}
    >
      {showIcon && <Tag className='size-3.5 text-[#94a3b8]' />}
      {showLabel ? (
        hasSelection ? (
          <span className='flex min-w-0 items-center gap-1.5'>
            {selectedLabels.slice(0, 2).map(label => (
              <IssueLabelBadge key={label._id} label={label} />
            ))}
            {selectedLabels.length > 2 ? (
              <span className='text-muted-foreground text-xs'>
                +{selectedLabels.length - 2}
              </span>
            ) : null}
          </span>
        ) : (
          summary
        )
      ) : null}
    </Button>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger ?? defaultTrigger}</PopoverTrigger>
      <PopoverContent align={align} className='w-72 p-0'>
        <Command>
          <CommandInput
            placeholder='Search labels...'
            className='h-9'
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No labels found.</CommandEmpty>
            {normalizedSearch && !hasExactMatch && onCreateLabel ? (
              <CommandGroup heading='Create'>
                <CommandItem
                  value={`create-${normalizedSearch}`}
                  onSelect={() => {
                    if (!viewOnly) {
                      void handleCreateLabel();
                    }
                  }}
                  disabled={viewOnly || isCreating}
                >
                  <Plus className='size-3.5' />
                  <span className='truncate'>
                    Create &quot;{normalizedSearch}&quot;
                  </span>
                </CommandItem>
              </CommandGroup>
            ) : null}
            <CommandGroup heading='Labels'>
              {allLabels.map(label => {
                const isSelected = displayLabelIds.includes(String(label._id));
                return (
                  <CommandItem
                    key={label._id}
                    value={label.name}
                    onSelect={() => {
                      if (!viewOnly) {
                        toggleLabel(String(label._id));
                      }
                    }}
                    disabled={viewOnly}
                  >
                    <Check
                      className={cn(
                        'size-3.5',
                        isSelected ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <span
                      className='size-2 rounded-full'
                      style={{ backgroundColor: label.color ?? '#94a3b8' }}
                    />
                    <span className='truncate'>{label.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
