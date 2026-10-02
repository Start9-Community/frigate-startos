import { VersionGraph } from '@start9labs/start-sdk'
import { current, FRIGATE_VERSION } from './current'
import { v_1_5_3_8 } from './v1.5.3_8'

export { FRIGATE_VERSION }

export const versionGraph = VersionGraph.of({
  current,
  other: [v_1_5_3_8],
})
