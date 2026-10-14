#!/usr/bin/env bash
set -euo pipefail
name=$1 task=$2
[[ $name =~ ^[a-z0-9-]+$ ]] || { echo "invalid name: $name" >&2; exit 1; }
cd "$(git rev-parse --show-toplevel)"

git worktree add ".trees/$name"
printf '%s\n\n%s\n' \
  "Work only inside this directory. Run tests/lint/build. Do not commit or push." \
  "$task" > ".trees/$name.task.md"

f=.vscode/tasks.json
mkdir -p .vscode
[ -f "$f" ] || echo '{"version":"2.0.0","tasks":[]}' > "$f"
jq --arg n "$name" '.tasks += [{
  label: ("claude: " + $n),
  type: "shell",
  command: ("claude -n " + $n + " \"$(cat ${workspaceFolder}/.trees/" + $n + ".task.md)\""),
  options: { cwd: ("${workspaceFolder}/.trees/" + $n) },
  isBackground: true,
  presentation: { panel: "dedicated", group: "claude" },
  problemMatcher: []
}]' "$f" > "$f.tmp" && mv "$f.tmp" "$f"

echo "Run: Tasks: Run Task -> claude: $name"
