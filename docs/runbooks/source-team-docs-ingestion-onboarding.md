# Source Team Runbook: Publish Documentation to the Developer Portal

## Review Dates

- Last reviewed: 2026-04-27

## Audience

This runbook is for source repository teams who want their documentation
ingested into the Ministry of Justice Developer Portal automatically.

## Outcome

After completing this runbook, your source repository can notify the
Developer Portal whenever docs change, and the portal ingestion workflow
will update content without manual intervention.

## Prerequisites

- You own or maintain a source repository in GitHub.
- You can add workflows and secrets to that source repository.
- You have a confirmed `source_id` that exactly matches the entry in the Developer Portal `sources.json`.

## Contract You Must Follow

- `sources.json` in the Developer Portal is the source of truth for:
  - `id`
  - `repo`
  - `branch`
  - `format`
  - `enabled`
- Source repo `portal.yaml` supports only these ingestion overrides:
  - `docs.path`
  - `owner_slack`
- Notification event must be:
  - `event-type: docs-update`
- Notification payload must include:
  - `client_payload.source_id` exactly matching your `sources.json` `id`

## Step 1: Confirm Your `source_id`

Confirm your source entry exists in the Developer Portal `sources.json` and note the exact `id` value.

If your source does not exist yet, request onboarding in the Developer Portal repo with:

- repository slug (`owner/repo`)
- default branch
- docs root path
- format (`tech-docs-template` or `markdown`)
- owner Slack channel
- proposed `id` (kebab-case)

## Step 2: Add `portal.yaml` at Source Repo Root

Create `portal.yaml` in your source repository root.

Use this minimal example:

```yaml
owner_slack: "#your-team-channel"

docs:
  path: source/documentation
```

Notes:

- Set `docs.path` to the folder that contains your docs.
- Keep this file limited to supported keys used by ingestion.

## Step 3: Add Source Repo Notification Workflow

Add this workflow file in your source repo:

- `.github/workflows/notify-portal.yml`

Use this template:

```yaml
name: Notify Developer Portal

on:
  push:
    branches: [main]
    paths:
      - "source/documentation/**"

jobs:
  notify:
    runs-on: ubuntu-latest
    env:
      SOURCE_ID: your-source-id
    steps:
      - name: Trigger portal ingestion
        uses: peter-evans/repository-dispatch@ff45666b9427631e3450c54a1bcbee4d9ff4d7c0 # v3
        with:
          token: ${{ secrets.PORTAL_DISPATCH_TOKEN }}
          repository: ministryofjustice/ministry-of-justice-developer-portal
          event-type: docs-update
          client-payload: '{"source_id": "${{ env.SOURCE_ID }}"}'
```

Replace:

- `SOURCE_ID` with your exact `sources.json` id
- `paths` glob if your docs path differs

## Step 4: Add Required Secret in Source Repo

Create this repository secret in your source repo:

- `PORTAL_DISPATCH_TOKEN`

Token requirements:

- Fine-grained PAT
- Access to `ministryofjustice/ministry-of-justice-developer-portal`
- Permission required to dispatch workflow events to the portal repository

## Step 5: Validate End-to-End

1. Commit a small docs change in your source repo under the configured path.
2. Confirm source workflow `Notify Developer Portal` runs successfully.
3. Confirm Developer Portal ingest workflow runs.
4. Confirm only your source is ingested when `source_id` is provided.
5. Confirm no commit is created in the portal repo when ingestion yields no content changes.

## Step 6: Validate Failure Behavior

Test with an invalid `source_id` (manual run in portal ingest workflow):

- Expected message: `No matching sources found`
- Expected result: workflow fails fast and does not commit

## Operational Checklist (Quick)

- `source_id` matches `sources.json`
- `portal.yaml` present with valid `docs.path`
- Source workflow uses `event-type: docs-update`
- Source workflow sends `client_payload.source_id`
- `PORTAL_DISPATCH_TOKEN` configured

## Troubleshooting

### Portal workflow says "No matching sources found"

- Check `SOURCE_ID` in source workflow matches `sources.json` exactly.
- Check source entry is `enabled: true`.

### Portal workflow says "Docs path not found"

- Check `portal.yaml` `docs.path` points to a real folder on default branch.
- If absent, check `docsPath` in Developer Portal `sources.json`.

### Source workflow succeeds but portal workflow does not trigger

- Verify `PORTAL_DISPATCH_TOKEN` is valid and not expired.
- Verify token permissions and target repository are correct.
- Verify `event-type` is `docs-update`.

## References

- [Documentation ingestion runbook](docs/runbooks/ingestion-runbook.md)
- [Source notification workflow example](docs/runbooks/notify-portal.yml.example)
- [Source `portal.yaml` example](docs/runbooks/portal.yaml.example)
- [Documentation template contract](docs/templates/spec-documentation.md)
