import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const FRIGATE_VERSION = '1.5.3.1'

export const current = VersionInfo.of({
  version: '1.5.3:2',
  releaseNotes: {
    en_US: 'Fix health check',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
