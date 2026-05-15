import { sdk } from '../sdk'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { setDependencies } from '../dependencies'
import { createDefaultConfig } from '../fileModels/config.json'
import { setConfig } from '../actions/config'
import * as T from '@start9labs/start-sdk/base/lib/types'
import { InitKind } from '@start9labs/start-sdk/base/lib/inits/setupInit'

async function setupConfig(effects: T.Effects, kind: InitKind) {
  // Always ensure config exists (safe to run on install and update)
  await createDefaultConfig(effects)

  if (kind === 'install') {
    await sdk.action.createOwnTask(effects, setConfig, 'critical', {
      reason: 'Configure Frigate settings',
    })
  }
}

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
  setupConfig,
)

export const uninit = sdk.setupUninit(versionGraph)
