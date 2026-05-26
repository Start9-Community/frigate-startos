# Frigate Electrum Server -- StartOS Package

## How the upstream version is pulled

- `FRIGATE_VERSION` in `startos/versions/index.ts` sets both the Docker image tag and the ExVer version string
- Docker image: `ghcr.io/remcoros/frigate-docker:<version>` (maintained separately at `remcoros/frigate-docker`)
- When bumping upstream: update `FRIGATE_VERSION` in `index.ts`, update the ExVer version string in the version file, and rebuild the Docker image in `frigate-docker` first

## Key files

| File | Purpose |
| --- | --- |
| `startos/manifest/index.ts` | Manifest: id, images, volumes, dependencies, hardware acceleration |
| `startos/versions/index.ts` | `FRIGATE_VERSION` constant and version graph |
| `startos/versions/v*.ts` | ExVer version info and migrations |
| `startos/fileModels/config.toml.ts` | Config file model (zod-typed), default values |
| `startos/actions/config.ts` | Configure Frigate action (user-facing settings) |
| `startos/dependencies.ts` | Dependency requirements and bitcoind autoconfig task |
| `startos/interfaces.ts` | Electrum interface on port 50001/50002 |
| `startos/main.ts` | Daemon setup, health checks, volume mounts |
| `startos/backups.ts` | Backup config (excludes `/db`) |
| `instructions.md` | User-facing setup instructions (linked as docsUrl) |
| `README.md` | Package README (keep in sync after every change) |

## Default overrides

- `index.startHeight` defaults to `840000` (upstream default is `709632`)
- Comment in `config.toml.ts` explains the divergence

## Validation

```
npm run check    # TypeScript type check
make x86         # Build x86_64 s9pk
```

Run `npm run prettier` before committing when available.

## Version bump checklist

1. Rebuild and push `ghcr.io/remcoros/frigate-docker:<new-version>`
2. Update `FRIGATE_VERSION` in `startos/versions/index.ts`
3. Rename `startos/versions/v<old>.ts` to `v<new>.ts`, update `version` and `releaseNotes`
4. Update the import and export in `startos/versions/index.ts`
5. Run `npm run check` and `make x86`

## Commit style

Conventional commits. Branch names: `update/<version>`, `feat/<name>`, `fix/<name>`, `chore/<name>`.
Do not push or tag without explicit instruction from Remco.
