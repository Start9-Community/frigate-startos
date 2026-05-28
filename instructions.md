# Frigate

Frigate is an experimental Electrum server with Silent Payments scanning support, built by the Sparrow Wallet team.

## Recommended setup

Install **Fulcrum** and set it as the backend Electrum server in Frigate's configuration. This enables standard Electrum address lookups in addition to Silent Payments scanning.

## Sync start height

The default start height is **840000**. For most users this is fine. It covers all practical Silent Payments wallets and keeps initial sync time reasonable.

Advanced options (via the Configure action):

- **Faster sync** - if you know your Silent Payments wallet only received funds from a specific block height onward, you can set that height as the start.
- **Full history** - lower the start height to **709632** (Taproot activation) to index all Silent Payments transactions since the beginning. This significantly increases initial sync time and is not needed for most users.

> Note: the upstream Frigate default is 709632. This package uses 840000 to reduce initial sync time.

## GPU support

Frigate can use a GPU to accelerate Silent Payments scanning. The compute backend can be set in the Configure action (default: Auto).

- **Nvidia** - should work. Not tested by the package author (no test hardware available). Reports welcome.
- **Intel** - should work. Not tested by the package author (no test hardware available). Reports welcome.
- **AMD** - should work using the AMD image variant with Mesa Rusticl OpenCL (`radeonsi`) bundled. Not tested by the package author (no test hardware available). Reports welcome.

Without a supported GPU, Frigate falls back to CPU automatically.
