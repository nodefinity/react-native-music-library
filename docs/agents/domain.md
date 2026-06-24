# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

This is a single-context repo.

Read these before architecture, diagnosis, TDD, triage, issue, or PRD work when they exist:

- `CONTEXT.md` at the repo root
- `docs/adr/` for architectural decisions that touch the area being explored

If either location does not exist, proceed silently. Do not flag its absence or suggest creating it upfront. Producer skills such as `/grill-with-docs` create them lazily when terms or decisions actually get resolved.

## Expected structure

```text
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

## Use the glossary's vocabulary

When output names a domain concept in an issue title, refactor proposal, hypothesis, or test name, use the term as defined in `CONTEXT.md`. Do not drift to synonyms the glossary explicitly avoids.

If the concept needed is not in the glossary yet, either reconsider whether the term belongs to the project language or note the gap for `/grill-with-docs`.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly rather than silently overriding it:

> _Contradicts ADR-0007 — but worth reopening because..._
