import { sdk } from '../sdk'
import { i18n } from '../i18n'
import {
  createDefaultConfig,
  config,
  ElectrumServerTypes,
  electrumServers,
  electrumServerByUrl,
  indexStartHeightDefault,
  bitcoindUrl,
} from '../fileModels/config.json'
import { Variants } from '@start9labs/start-sdk/base/lib/actions/input/builder'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  electrumServer: Value.dynamicUnion(async ({ effects }) => {
    // determine default server type and disabled options
    const installedPackages = await effects.getInstalledPackages()
    let serverType: ElectrumServerTypes = 'none'
    let disabled: ElectrumServerTypes[] = []

    if (installedPackages.includes('electrs')) {
      serverType = 'electrs'
    } else {
      disabled.push('electrs')
    }

    if (installedPackages.includes('fulcrum')) {
      serverType = 'fulcrum'
    } else {
      disabled.push('fulcrum')
    }

    return {
      name: i18n('Electrum Server'),
      description: i18n('Electrum Backend Server'),
      default: serverType,
      disabled: disabled,
      variants: Variants.of({
        fulcrum: {
          name:
            i18n('Fulcrum (recommended)') +
            (disabled.includes('fulcrum') ? ' ' + i18n('(not installed)') : ''),
          spec: InputSpec.of({}),
        },
        electrs: {
          name:
            i18n('Electrs') +
            (disabled.includes('electrs') ? ' ' + i18n('(not installed)') : ''),
          spec: InputSpec.of({}),
        },
        none: {
          name: i18n('None (not recommended)'),
          spec: InputSpec.of({}),
        },
      }),
    }
  }),
  advanced: Value.object(
    {
      name: i18n('Advanced settings'),
      description: i18n('Advanced settings'),
    },
    InputSpec.of({
      startIndexing: Value.toggle({
        name: i18n('Start Indexing on Launch'),
        description: i18n(
          'Whether Frigate should start indexing the blockchain upon launch.',
        ),
        default: true,
      }),
      indexStartHeight: Value.number({
        name: i18n('Index Start Height'),
        description: i18n(
          'The block height from which Frigate should start indexing.',
        ),
        required: true,
        integer: true,
        min: 0,
        max: null,
        default: indexStartHeightDefault,
      }),
      scriptPubKeyCacheSize: Value.number({
        name: i18n('Script PubKey Cache Size'),
        description: i18n(
          'The size of the Script PubKey cache in bytes (default 10,000,000).',
        ),
        required: true,
        integer: true,
        min: 0,
        max: null,
        default: 10000000,
      }),
    }),
  ),
})

export const setConfig = sdk.Action.withInput(
  // id
  'config',

  // metadata
  async ({ effects }) => ({
    name: i18n('Configure Frigate'),
    description: i18n('Set or update Frigate configuration settings.'),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('Configuration'),
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    let currentConfig = await config.read().once()
    if (!currentConfig) {
      await createDefaultConfig(effects)
      currentConfig = (await config.read().once())!
    }

    return {
      electrumServer: {
        selection:
          electrumServerByUrl[currentConfig.backendElectrumServer] || 'none',
      },
      advanced: {
        startIndexing: currentConfig.startIndexing,
        indexStartHeight: currentConfig.indexStartHeight,
        scriptPubKeyCacheSize: currentConfig.scriptPubKeyCacheSize,
      },
    }
  },

  // the execution function
  async ({ effects, input }) => {
    await config.merge(effects, {
      coreServer: bitcoindUrl,
      coreAuthType: 'COOKIE',
      coreAuth: '',
      coreDataDir: '/root/.bitcoin',
      startIndexing: input.advanced.startIndexing,
      indexStartHeight: input.advanced.indexStartHeight,
      scriptPubKeyCacheSize: input.advanced.scriptPubKeyCacheSize,
      backendElectrumServer:
        electrumServers[
          input.electrumServer.selection as ElectrumServerTypes
        ] ?? '',
    })
  },
)
