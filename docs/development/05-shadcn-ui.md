# Using Shadcn UI

We use [shadcn/ui](https://ui.shadcn.com) for our component library. It provides nicely-styled, accessible components powered by Radix UI.

## Adding New Components

The shadcn/ui toolkit includes a CLI for scaffolding new components directly into the project. The components are copied to your codebase, so you have full control over them.

To add a new component, run the following command:

```bash
pnpm dlx shadcn-ui@latest add <component-name> --yes
```

For example, to add the `alert-dialog` and `tabs` components:

```bash
pnpm dlx shadcn-ui@latest add alert-dialog tabs --yes
```

The CLI will read the `components.json` file to determine where to place the new component files (in our case, `src/components/ui`).

## Rules for Usage

1.  **Do not run `init`**: The `init` command should only be run once. Since `components.json` already exists in the repository, you should never need to run it again.
2.  **Use `pnpm dlx`**: Always use `pnpm dlx shadcn-ui@latest ... --yes` to run the CLI. This ensures you are using the latest version without installing it as a permanent dependency, and it automatically confirms any prompts.
3.  **Check compilation**: After adding a new component, run the development server (`pnpm dev`) to ensure that all Tailwind classes are compiled correctly.
4.  **Import paths**: Import components from the `@/components/ui` alias.
