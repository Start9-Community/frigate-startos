import { VersionGraph } from '@start9labs/start-sdk'
import { current, FRIGATE_VERSION } from './current'
import { v1_5_3_4 } from './v1.5.3.4'

export { FRIGATE_VERSION }

export const versionGraph = VersionGraph.of({
  current,
  other: [v1_5_3_4],
})
