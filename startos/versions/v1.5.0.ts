import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v1_5_0 = VersionInfo.of({
  version: '1.5.0:1-beta.1',
  releaseNotes: {
    en_US: 'Initial release of Frigate for StartOS 0.4',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})

export const FRIGATE_VERSION = '1.5.0'
