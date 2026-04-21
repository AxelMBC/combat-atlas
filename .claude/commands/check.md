Run a full project audit in sequence:

1. **TypeScript** – run `yarn tsc -b --noEmit` to catch type errors
2. **Lint** – run `yarn lint` to catch lint issues

After each command, capture the output and note any failures.

At the end, give a summary of what passed and what failed. If anything failed, show the relevant errors grouped by category (TS / Lint).
