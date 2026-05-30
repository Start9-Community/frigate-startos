import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const FRIGATE_VERSION = '1.5.3'

export const current = VersionInfo.of({
  version: '1.5.3:0',
  releaseNotes: {
    en_US: 'Initial release of Frigate for StartOS 0.4',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
