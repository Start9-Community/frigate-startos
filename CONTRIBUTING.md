# Contributing

## Building and Development

See the [StartOS Packaging Guide](https://docs.start9.com/packaging/) for complete environment setup and build instructions.

### Quick Start

```bash
# Install dependencies
npm ci

# Type check
npm run check

# Build x86_64 package
make x86

# Build and install on a running StartOS server
# (requires `host: https://server-name.local` in ~/.embassy/config.yaml)
make x86 install
```

### Docker Image

Frigate's Docker image is maintained separately at [remcoros/frigate-docker](https://github.com/remcoros/frigate-docker). When bumping the upstream Frigate version, rebuild and push the Docker image there first, then update `FRIGATE_VERSION` in this repo.

### Code Style

Run `npm run prettier` before committing.

## How to Contribute

1. Fork the repository and create a branch from `main`
2. Make your changes
3. Run `npm run check` and `make x86` to verify the build
4. Open a pull request to `main`
