import { FileHelper } from '@start9labs/start-sdk'
import { config } from './fileModels/config.json'
import { sdk } from './sdk'

export const main = sdk.setupMain(async ({ effects, started }) => {
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

  // set watch on bitcoin .cookie file to restart daemon on changes
  await FileHelper.string(`${subcontainer.rootfs}/root/.bitcoin/.cookie`)
    .read()
    .const(effects)

  return sdk.Daemons.of(effects, started).addDaemon('primary', {
    subcontainer: subcontainer,
    exec: {
      command: sdk.useEntrypoint(),
      env: {
        NETWORK: 'mainnet',
      },
    },
    ready: {
      display: 'Frigate Electrum Server',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, 57001, {
          successMessage: 'Frigate is running',
          errorMessage: 'Frigate is syncing...',
        }),
    },
    requires: [],
  })
})
