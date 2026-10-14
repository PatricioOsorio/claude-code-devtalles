---
description: Create an isolated git worktree in .trees/ and register a VS Code task that opens Claude there
argument-hint: <task description>
allowed-tools: Bash(scripts/worktree.sh:*)
---

Derive a short kebab-case name (2-4 words, English, ASCII, only `[a-z0-9-]`) from: $ARGUMENTS
Run: `scripts/worktree.sh <name> "<full task text>"`
If it fails because the worktree/branch exists, retry with `-2`, `-3`. Report the script output.
