import { VersionInfo } from '@start9labs/start-sdk'

export const FRIGATE_VERSION = '1.5.3.2'

export const current = VersionInfo.of({
  version: '1.5.3:3',
  releaseNotes: {
    en_US: 'use a different image for AMD GPUs',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
