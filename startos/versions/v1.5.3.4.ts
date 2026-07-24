import { VersionInfo } from '@start9labs/start-sdk'

export const v1_5_3_4 = VersionInfo.of({
  version: '1.5.3:4',
  releaseNotes: { en_US: 'Try fix AMD support' },
  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
