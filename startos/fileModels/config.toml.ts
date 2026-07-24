import { z, FileHelper, T } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Default start height used by this package. Upstream default is 709632 (Taproot activation on mainnet).
// We use a more recent height to speed up initial sync for typical users.
export const indexStartHeightDefault = 840000
export type ElectrumServerType = 'fulcrum' | 'electrs' | 'none'
export const legacyElectrumServers: Record<ElectrumServerType, string> = {
  fulcrum: 'tcp://fulcrum.startos:50001',
  electrs: 'tcp://electrs.startos:50001',
  none: '',
}
export const legacyElectrumServerByUrl = Object.fromEntries(
  Object.entries(legacyElectrumServers).map(([key, value]) => [value, key]),
) as Record<string, ElectrumServerType>

// Matches Frigate's native config.toml structure
const shape = z.object({
  core: z
    .object({
      connect: z.boolean().catch(true),
      server: z.string().optional().catch(undefined),
      authType: z
        .union([z.literal('USERPASS'), z.literal('COOKIE')])
        .catch('COOKIE' as const),
      auth: z.string().catch(''),
      dataDir: z.string().catch('/root/.bitcoin'),
      zmqSequenceEndpoint: z.string().optional().catch(undefined),
    })
    .catch({
      connect: true,
      authType: 'COOKIE' as const,
      auth: '',
      dataDir: '/root/.bitcoin',
    }),
  index: z
    .object({
      startHeight: z.number().catch(indexStartHeightDefault),
      cacheSize: z.string().catch('10M'),
    })
    .catch({
      startHeight: indexStartHeightDefault,
      cacheSize: '10M',
    }),
  scan: z
    .object({
      computeBackend: z
        .union([z.literal('AUTO'), z.literal('GPU'), z.literal('CPU')])
        .catch('AUTO' as const),
      batchSize: z.number().catch(300000),
    })
    .catch({
      computeBackend: 'AUTO' as const,
      batchSize: 300000,
    }),
  server: z
    .object({
      backendElectrumServer: z.string().catch(''),
    })
    .catch({
      backendElectrumServer: '',
    }),
})

export type FrigateConfigType = z.infer<typeof shape>

export const config = FileHelper.toml(
  {
    base: sdk.volumes.main,
    subpath: '/config.toml',
  },
  shape,
)

export const createDefaultConfig = async (effects: T.Effects) => {
  const conf = await config.read().once()
  if (!conf) {
    await config.write(effects, {
      core: {
        connect: true,
        authType: 'COOKIE',
        auth: '',
        dataDir: '/root/.bitcoin',
      },
      index: {
        startHeight: indexStartHeightDefault,
        cacheSize: '10M',
      },
      scan: {
        computeBackend: 'AUTO',
        batchSize: 300000,
      },
      server: {
        backendElectrumServer: '',
      },
    })
  }
}
