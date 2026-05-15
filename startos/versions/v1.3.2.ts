import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v1_3_2 = VersionInfo.of({
  version: '1.3.2:2.0',
  releaseNotes: { en_US: 'Initial release for StartOS' },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})

export const FRIGATE_VERSION = '1.3.2'
