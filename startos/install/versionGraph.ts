import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { createDefaultConfig, config } from '../fileModels/config.json'
import { sdk } from '../sdk'
import { setConfig } from '../actions/config'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    await createDefaultConfig(effects)

    await sdk.action.createOwnTask(effects, setConfig, 'critical', {
      reason: 'Configure Frigate settings',
    })
  },
})
