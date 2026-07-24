import { T } from '@start9labs/start-sdk'
import { store } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { autoconfig } from 'bitcoind-startos/startos/actions/config/autoconfig'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  // Require txindex and ZMQ in bitcoind (ZMQ needed for low-latency mempool ingestion since 1.5.0)
  await sdk.action.createTask(effects, 'bitcoind', autoconfig, 'critical', {
    input: {
      kind: 'partial',
      accept: [
        {
          txindex: true,
          prune: 0,
          zmqEnabled: true,
        },
      ],
      set: {
        txindex: true,
        prune: 0,
        zmqEnabled: true,
      },
    },
    reason: i18n(
      'Frigate requires txindex, pruning disabled, and ZMQ enabled in Bitcoin Core.',
    ),
    when: { condition: 'input-not-matches', once: false },
  })

  let currentDeps = {} as Record<'electrs' | 'fulcrum', T.DependencyRequirement>

  const backendElectrumServer = await store
    .read((value) => value.electrumServer)
    .const(effects)

  if (backendElectrumServer === 'electrs') {
    currentDeps.electrs = {
      id: 'electrs',
      kind: 'running',
      versionRange: '>=0.11.1',
      healthChecks: ['electrs', 'sync'],
    }
  } else if (backendElectrumServer === 'fulcrum') {
    currentDeps.fulcrum = {
      id: 'fulcrum',
      kind: 'running',
      versionRange: '>=2.1.0',
      healthChecks: ['primary', 'sync-progress'],
    }
  }

  return {
    bitcoind: {
      kind: 'running',
      versionRange: '>=28.3',
      healthChecks: ['bitcoind', 'sync-progress'],
    },
    ...currentDeps,
  }
})
