# AGENTS.md

## Agent skills

### Issue tracker

Issues live in GitHub Issues at `dontrusu/recruiter-simulaitor`, driven with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles map 1:1 to `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` plus `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Project architecture

Before changing application structure, state management, or code organization, read [the architecture guide](docs/architecture.md) and relevant ADRs. Treat the guide as a living direction; discuss significant conflicts and update it when practice warrants.
