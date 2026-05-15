import { z, FileHelper, T } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const indexStartHeightDefault = 709632 // taproot activation height on mainnet
export const bitcoindUrl = 'http://bitcoind.startos:8332'
export type ElectrumServerTypes = 'fulcrum' | 'electrs' | 'none'
export const electrumServers: Record<ElectrumServerTypes, string> = {
  fulcrum: 'tcp://fulcrum.startos:50001',
  electrs: 'tcp://electrs.startos:50001',
  none: '',
}
export const electrumServerByUrl = Object.fromEntries(
  Object.entries(electrumServers).map(([key, value]) => [value, key]),
) as Record<string, ElectrumServerTypes>

const shape = z.object({
  coreServer: z.string().catch(bitcoindUrl),
  coreAuthType: z
    .union([z.literal('USERPASS'), z.literal('COOKIE')])
    .catch('COOKIE' as const),
  coreAuth: z.string().catch(''),
  coreDataDir: z.string().catch('/root/.bitcoin'),
  startIndexing: z.boolean().catch(true),
  indexStartHeight: z.number().catch(indexStartHeightDefault),
  scriptPubKeyCacheSize: z.number().catch(10000000),
  useCuda: z.boolean().catch(false),
  cudaBatchSize: z.number().catch(300000),
  backendElectrumServer: z.string().catch(''),
})

export type FrigateConfigType = z.infer<typeof shape>

export const config = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: '/config', // note: no .json extension!
  },
  shape,
)

export const createDefaultConfig = async (effects: T.Effects) => {
  // check if the file exists (from previous installs or upgrades)
  const conf = await config.read().once()
  if (!conf) {
    await config.write(effects, {
      coreServer: bitcoindUrl,
      coreAuthType: 'COOKIE',
      coreAuth: '',
      coreDataDir: '/root/.bitcoin',
      startIndexing: true,
      indexStartHeight: 0,
      scriptPubKeyCacheSize: 10000000,
      useCuda: false,
      cudaBatchSize: 300000,
      backendElectrumServer: '',
    })
  }
}
