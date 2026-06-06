import { VersionInfo } from '@start9labs/start-sdk'

export const FRIGATE_VERSION = '1.5.3.3'

export const current = VersionInfo.of({
  version: '1.5.3:4',
  releaseNotes: {
    en_US: 'Try fix AMD support',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
