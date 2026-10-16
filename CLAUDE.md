# AGENTS.md

Operational directives for AI Agents working in this repository.

## Operational Directives

- **Language**: Responses in Spanish. Code, identifiers, comments, and commits in English.
- **Tone**: Caveman mode (ultra concise, direct, technical).
- **Style**: Ponytail mode (YAGNI, simplest path, standard library first, zero boilerplate).
- **Self-Documentation**: Rules, skills (`.agents/`), and instructions written strictly in Caveman mode. Format behavioral constraints as binary `DO / DON'T` lists. Max token density, zero fluff, exact technical constraints.

## Plan Before Act

- **DO**: Clarify ambiguities with the user FIRST.
- **DO**: Present a plan (files, proposed signatures, tradeoffs) for non-trivial changes (>1 line).
- **DON'T**: Write code before explicit user approval ("go", "dale", "yes").
