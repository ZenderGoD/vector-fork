'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { FunctionReturnType } from 'convex/server';
import { MessageSquareMore } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { RichEditor } from '@/components/ui/rich-editor';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/components/user-avatar';
import { UserProfilePopover } from '@/components/user-profile-popover';
import { formatDateHuman } from '@/lib/date';
import { cn } from '@/lib/utils';

type IssueComment = FunctionReturnType<
  typeof api.issues.queries.listComments
>[number];

function CommentsSkeleton() {
  return (
    <div className='space-y-3'>
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className='rounded-lg border px-3 py-3'>
          <div className='mb-3 flex items-center gap-2'>
            <Skeleton className='size-7 rounded-full' />
            <div className='space-y-1'>
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-3 w-20' />
            </div>
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-3 w-full' />
            <Skeleton className='h-3 w-5/6' />
            <Skeleton className='h-3 w-3/4' />
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentCard({ comment }: { comment: IssueComment }) {
  const authorName = comment.author?.name ?? comment.author?.email ?? 'Unknown';
  const authorEmail = comment.author?.email ?? null;
  const body = comment.deleted ? '_Comment deleted_' : comment.body;

  return (
    <div className='rounded-lg border px-3 py-3'>
      <div className='mb-3 flex items-center gap-2'>
        <UserProfilePopover
          name={authorName}
          email={authorEmail}
          image={comment.author?.image ?? null}
          userId={comment.author?._id ?? null}
          align='start'
        >
          <button className='flex items-center gap-2 rounded-md'>
            <UserAvatar
              name={authorName}
              email={authorEmail}
              image={comment.author?.image ?? null}
              userId={comment.author?._id ?? null}
              size='sm'
              className='size-7'
            />
            <div className='min-w-0 text-left'>
              <p className='truncate text-sm font-medium'>{authorName}</p>
              <p className='text-muted-foreground text-xs'>
                {formatDateHuman(new Date(comment._creationTime))}
              </p>
            </div>
          </button>
        </UserProfilePopover>
      </div>
      <div
        className={cn(
          'text-sm',
          comment.deleted && 'text-muted-foreground italic',
        )}
      >
        <RichEditor value={body} onChange={() => {}} disabled={true} />
      </div>
    </div>
  );
}

export function IssueComments({
  orgSlug,
  issueId,
}: {
  orgSlug: string;
  issueId: Id<'issues'>;
}) {
  const [draft, setDraft] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const comments = useQuery(api.issues.queries.listComments, { issueId });
  const user = useQuery(api.users.currentUser);
  const addComment = useMutation(api.issues.mutations.addComment);

  const sortedComments = useMemo(
    () =>
      (comments ?? [])
        .slice()
        .sort((left, right) => left._creationTime - right._creationTime),
    [comments],
  );

  const handleSubmit = async () => {
    const nextDraft = draft.trim();
    if (!nextDraft || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment({ issueId, body: nextDraft });
      setDraft('');
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to post comment',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = draft.trim().length > 0 && !isSubmitting;

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <MessageSquareMore className='text-muted-foreground size-4' />
        <h2 className='text-sm font-semibold'>
          Comments
          {comments ? (
            <span className='text-muted-foreground ml-2 text-xs font-normal'>
              {comments.length}
            </span>
          ) : null}
        </h2>
      </div>

      <div className='rounded-lg border px-3 py-3'>
        <div className='mb-3 flex items-center gap-2'>
          <UserAvatar
            name={user?.name ?? user?.email ?? 'You'}
            email={user?.email ?? null}
            image={user?.image ?? null}
            userId={user?._id ?? null}
            size='sm'
            className='size-7'
          />
          <span className='text-sm font-medium'>Add a comment</span>
        </div>
        <RichEditor
          value={draft}
          onChange={setDraft}
          placeholder='Reply with context, updates, or mention a teammate...'
          mode='compact'
          orgSlug={orgSlug}
        />
        <div className='mt-3 flex items-center justify-end gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setDraft('')}
            disabled={draft.length === 0 || isSubmitting}
          >
            Clear
          </Button>
          <Button size='sm' onClick={handleSubmit} disabled={!canSubmit}>
            {isSubmitting ? 'Posting…' : 'Post comment'}
          </Button>
        </div>
      </div>

      {comments === undefined ? (
        <CommentsSkeleton />
      ) : sortedComments.length === 0 ? (
        <div className='text-muted-foreground rounded-lg border border-dashed px-3 py-8 text-center text-sm'>
          No comments yet. Use comments to keep discussion attached to the work.
        </div>
      ) : (
        <div className='space-y-3'>
          {sortedComments.map(comment => (
            <CommentCard key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
