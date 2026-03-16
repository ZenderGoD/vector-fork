# Linear Parity Buckets

This document captures the main product gaps between Vector's current surface area and the parts of Linear that are worth copying.

It is not a goal to reproduce Linear feature-for-feature. The goal is to identify the features that materially improve issue planning, team execution, and workflow speed.

## Must Have

These features are the highest leverage gaps and should be treated as the main parity track.

### 1. Issue Collaboration Surface

- Visible issue comments thread on the issue detail page
- Comment composer with mentions
- Labels on issues, including list/detail/create flows
- Better issue metadata density for triage

Why this matters:

- Vector already has issues, sub-issues, assignments, and activity
- Without comments and labels in the core issue UX, the issue detail page feels incomplete
- This is the fastest path to making issues feel alive instead of static records

### 2. Planning Cadence

- Cycles or sprints
- Cycle-aware issue filters and views
- Cycle progress summaries

Why this matters:

- This is a defining Linear workflow
- It gives teams a consistent planning rhythm instead of a flat issue list

### 3. Portfolio Planning

- Roadmaps or initiatives above projects
- Milestones tied to projects and issues
- Progress rollups across workstreams

Why this matters:

- Projects exist today, but there is no higher-level planning layer
- This prevents Vector from covering the "team execution + leadership planning" use case

### 4. Saved Views And Fast Triage

- Saved filters
- Shared views
- Better bulk issue actions
- "My work", "backlog", and custom triage queues

Why this matters:

- Current issue filtering is useful but shallow
- Saved views are one of the highest-ROI workflow accelerators in Linear-like products

### 5. Global Search And Command Workflow

- Workspace-wide search
- Keyboard-first command palette
- Quick open for issues, projects, teams, and docs
- Quick-create actions

Why this matters:

- Vector already has search primitives
- Exposing them globally unlocks much faster navigation and editing

## Nice To Have

These features are valuable, but they should come after the must-have workflow layer.

### 1. Analytics And Delivery Insights

- Throughput charts
- Cycle time
- Completion trends
- Workload views

### 2. Richer Notifications

- More issue event coverage
- Finer-grained notification rules
- Better inbox grouping and triage actions

### 3. Project Surface Expansion

- Project-linked documents tab
- Project health summary
- Milestone view
- Better project progress reporting

### 4. Integrations

- GitHub
- Slack
- Sentry
- Webhooks

### 5. Import / Export / API

- CSV import
- Public API
- Automation hooks for external tooling

## Not Worth Copying Directly

These are areas where copying Linear too literally would add complexity before Vector has earned it.

### 1. Full Feature Parity Chasing

- Do not build every Linear object just because Linear has it
- Keep the object model compact and tied to real workflows

### 2. Overbuilt Analytics Early

- Avoid dashboards full of vanity charts
- Basic operational metrics are enough until cycles and roadmaps exist

### 3. Complex Automation Before Core Workflows

- Webhook builders
- Rule engines
- Heavy integration marketplaces

These should wait until issue collaboration, planning cadence, and saved views are solid.

### 4. Separate Edit Screens For Routine Metadata

- Vector's current inline editing model is a strength
- Linear parity should reinforce that pattern, not regress it
