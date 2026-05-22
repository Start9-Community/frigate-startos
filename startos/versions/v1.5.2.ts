import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v1_5_2 = VersionInfo.of({
  version: '1.5.2:0-beta.2',
  releaseNotes: {
    en_US: 'Initial release of Frigate for StartOS 0.4',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
