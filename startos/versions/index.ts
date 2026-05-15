import { VersionGraph } from '@start9labs/start-sdk'
import { v1_3_2 } from './v1.3.2'

export { v1_3_2 as current }
export const other = []

export const versionGraph = VersionGraph.of({
  current: v1_3_2,
  other: [],
})

export const FRIGATE_VERSION = '1.3.2'
