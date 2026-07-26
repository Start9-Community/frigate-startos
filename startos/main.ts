import { FileHelper } from '@start9labs/start-sdk'
import {
  rpcHostId,
  rpcPort,
  zmqHostId,
  zmqPortTransaction,
} from 'bitcoind-startos/startos/utils'
import {
  electrumHostId as electrsHostId,
  port as electrsPort,
} from 'electrs-startos/startos/utils'
import {
  electrumPort as fulcrumPort,
  mainHostId as fulcrumHostId,
} from 'fulcrum-startos/startos/utils'
import { config } from './fileModels/config.toml'
import { store } from './fileModels/store.json'
import { sdk } from './sdk'
import { i18n } from './i18n'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting Frigate...')

  // Watch only user-controlled settings. Address rewrites below do not restart
  // main unless the selected provider or its assigned bridge port changes.
  await config.read(({ index, scan }) => ({ index, scan })).const(effects)

  const selection =
    (await store.read((value) => value.electrumServer).const(effects)) ?? 'none'
  const rpcAddress = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'bitcoind',
      hostId: rpcHostId,
      internalPort: rpcPort,
      ssl: false,
    })
    .const()
  const zmqAddress = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'bitcoind',
      hostId: zmqHostId,
      internalPort: zmqPortTransaction,
    })
    .const()
  const backendAddress =
    selection === 'fulcrum'
      ? await sdk.host
          .getBridgeAddress(effects, {
            packageId: 'fulcrum',
            hostId: fulcrumHostId,
            internalPort: fulcrumPort,
          })
          .const()
      : selection === 'electrs'
        ? await sdk.host
            .getBridgeAddress(effects, {
              packageId: 'electrs',
              hostId: electrsHostId,
              internalPort: electrsPort,
            })
            .const()
        : null

  await config.merge(
    effects,
    {
      core: {
        connect: true,
        server: rpcAddress ? `http://${rpcAddress}` : undefined,
        authType: 'COOKIE',
        auth: '',
        dataDir: '/root/.bitcoin',
        zmqSequenceEndpoint: zmqAddress ? `tcp://${zmqAddress}` : undefined,
      },
      server: {
        backendElectrumServer: backendAddress ? `tcp://${backendAddress}` : '',
      },
    },
    { allowWriteAfterConst: true },
  )

  const subcontainer = await sdk.SubContainer.eager(
    effects,
    {
      imageId: 'main',
    },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/root/.frigate',
        readonly: false,
      })
      .mountDependency({
        dependencyId: 'bitcoind',
        mountpoint: '/root/.bitcoin',
        volumeId: 'main',
        subpath: null,
        readonly: true,
      }),
    'main',
  )

  // watch bitcoin .cookie file to restart daemon on changes
  await FileHelper.string(`${subcontainer.rootfs}/root/.bitcoin/.cookie`)
    // Ignore removal during Bitcoin Core shutdown; restart only after a
    // replacement cookie is written.
    .read(
      (cookie) => cookie,
      (prev, next) => next === null || prev === next,
    )
    .const(effects)

  // Keep track of the latest sync-progress line from stdout.
  // Captured by onStdout on the primary daemon; read by the sync-progress health check.
  let lastSyncLog: string | null = null

  return sdk.Daemons.of(effects)
    .addDaemon('primary', {
      subcontainer: subcontainer,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          NETWORK: 'mainnet',
        },
        onStdout: (chunk) => {
          const text = Buffer.isBuffer(chunk)
            ? chunk.toString('utf8')
            : String(chunk)

          console.log(text)

          const match = text.match(/Indexing progress: (.+)/)
          if (match) {
            lastSyncLog = match[1].trim()
          }
        },
      },
      ready: {
        display: i18n('Electrum Server'),
        fn: async () => {
          const result = await sdk.healthCheck.checkPortListening(
            effects,
            50001,
            {
              successMessage: i18n('Frigate is running'),
              errorMessage: i18n('Frigate is syncing...'),
            },
          )

          if (result.result === 'success') return result

          return {
            result: 'loading',
            message: i18n('Frigate is syncing...'),
          }
        },
      },
      requires: [],
    })
    .addHealthCheck('sync-progress', {
      ready: {
        display: i18n('Sync Progress'),
        fn: async () => {
          // If the port is open, Frigate is fully synced.
          const portCheck = await sdk.healthCheck.checkPortListening(
            effects,
            50001,
            {
              successMessage: i18n('Fully synced'),
              errorMessage: '',
            },
          )
          if (portCheck.result === 'success') return portCheck

          if (!lastSyncLog) {
            return {
              message: i18n('Frigate is syncing...'),
              result: 'loading',
            }
          }

          return {
            message: lastSyncLog,
            result: 'loading',
          }
        },
      },
      requires: [],
    })
})
