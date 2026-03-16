# Linear Implementation Roadmap

This roadmap turns the parity buckets into a practical implementation order.

## Phase 1

Goal: make issue execution feel complete.

Scope:

- Ship issue comments UI on the issue detail page
- Ship issue labels end-to-end
- Tighten issue detail polish where the comment and label flows expose rough edges

Success criteria:

- Users can discuss work directly on issues
- Users can tag and filter issues with labels
- The issue page feels like the operational center of the app

## Phase 2

Goal: add planning rhythm.

Scope:

- Introduce cycles
- Assign issues to cycles
- Add cycle filtering to issues views
- Add basic cycle progress reporting

Success criteria:

- Teams can plan and execute work in time-boxed batches
- Cycle state is visible from issue lists and issue detail pages

## Phase 3

Goal: improve navigation and triage speed.

Scope:

- Global search surface
- Keyboard command palette
- Saved views for issues
- Bulk actions for issue triage

Success criteria:

- Common workflows become keyboard-first
- Teams can preserve and share working views instead of rebuilding filters repeatedly

## Phase 4

Goal: add portfolio-level planning.

Scope:

- Initiatives or roadmap items
- Project-to-initiative relationships
- Milestones and progress rollups

Success criteria:

- Leadership planning can happen in the same workspace as execution
- Projects and issues roll up into understandable higher-level plans

## Phase 5

Goal: expand ecosystem and reporting.

Scope:

- Delivery analytics
- Richer notifications
- Integrations
- Import / export / public API

Success criteria:

- Vector becomes easier to adopt in an existing toolchain
- Teams can report on delivery without leaving the product

## Current Execution Focus

Start with Phase 1.

Reasoning:

- Comments already have backend support
- Labels already have schema support
- Both features materially improve the current issue workflow
- They are much cheaper than cycles or initiatives and unlock better day-to-day usage immediately
