import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v1_3_2 = VersionInfo.of({
  version: '1.3.2:1.0',
  releaseNotes: 'Initial release for StartOS',
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})

export const FRIGATE_VERSION = '1.3.2'
