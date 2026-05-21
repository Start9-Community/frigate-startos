import { FileHelper } from '@start9labs/start-sdk'
import { config } from './fileModels/config.toml'
import { sdk } from './sdk'
import { i18n } from './i18n'
import { parseCookie } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting Frigate...')

  const conf = (await config.read().const(effects))!

  const subcontainer = await sdk.SubContainer.of(
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
  const cookie = await FileHelper.string(
    `${subcontainer.rootfs}/root/.bitcoin/.cookie`,
  )
    .read()
    .const(effects)
  const [_RPC_USERNAME, _RPC_PASSWORD] = parseCookie(cookie)

  // Keep track of the latest sync-progress line from the log file.
  // Updated by the sync-progress health check and read by the primary ready fn.
  let lastSyncLog: string | null = null

  return sdk.Daemons.of(effects)
    .addDaemon('primary', {
      subcontainer: subcontainer,
      exec: {
        // @todo env vars are overridden by Dockerfile defaults: see: https://github.com/Start9Labs/start-os/issues/3050
        //command: sdk.useEntrypoint(),
        command: ['/opt/frigate/bin/frigate', '-n', 'mainnet'],
        env: {
          NETWORK: 'mainnet',
        },
      },
      ready: {
        display: i18n('Electrum Server'),
        fn: async () => {
          const result = await sdk.healthCheck.checkPortListening(
            effects,
            57001,
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
            57001,
            {
              successMessage: i18n('Fully synced'),
              errorMessage: '',
            },
          )
          if (portCheck.result === 'success') return portCheck

          try {
            const res = await subcontainer.exec([
              'sh',
              '-c',
              `tac /root/.frigate/frigate.log | grep -m1 'Indexing progress:'`,
            ])
            if (
              res.exitCode === 0 &&
              typeof res.stdout === 'string' &&
              res.stdout !== ''
            ) {
              // Extract "5409 / 240756 blocks (2.2%, height 715040)" from the log line
              const match = res.stdout.match(/Indexing progress: (.+)/)
              lastSyncLog = match ? match[1].trim() : res.stdout.trim()
              return {
                message: lastSyncLog,
                result: 'loading',
              }
            } else {
              return {
                message: i18n('Frigate is syncing...'),
                result: 'loading',
              }
            }
          } catch (err) {
            return {
              message: `Error fetching block height: ${err}`,
              result: 'failure',
            }
          }
        },
      },
      requires: [],
    })
})
