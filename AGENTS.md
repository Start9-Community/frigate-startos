# Frigate Electrum Server -- StartOS Package

## How the upstream version is pulled

- `FRIGATE_VERSION` in `startos/versions/current.ts` sets both the Docker image tag and the ExVer version string
- Docker image: `ghcr.io/remcoros/frigate-docker:<version>` (maintained separately at `remcoros/frigate-docker`)
- Two Docker image variants: default (`<version>`) for generic/nvidia, and `<version>-amd` for the AMD variant
- When bumping upstream: update `FRIGATE_VERSION` in `current.ts`, update the ExVer version string there, and rebuild the Docker images in `frigate-docker` first

## Key files

| File | Purpose |
| --- | --- |
| `startos/manifest/index.ts` | Manifest: id, images (3 variants: generic/nvidia/amd), volumes, dependencies, hardware acceleration |
| `startos/versions/current.ts` | `FRIGATE_VERSION` constant and current ExVer version info |
| `startos/versions/index.ts` | Exports `current` and `versionGraph` |
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

1. Update `FRIGATE_VERSION` in `startos/versions/current.ts`
2. Update the ExVer `version` and `releaseNotes` in `startos/versions/current.ts`
3. Run `npm run check` and `make x86`

## Commit style

Conventional commits. Branch names: `update/<version>`, `feat/<name>`, `fix/<name>`, `chore/<name>`.

