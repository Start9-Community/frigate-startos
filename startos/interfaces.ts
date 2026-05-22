import { sdk } from './sdk'
import { i18n } from './i18n'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const electrumMulti = sdk.MultiHost.of(effects, 'electrum')
  const electrumMultiOrigin = await electrumMulti.bindPort(50001, {
    protocol: null,
    addSsl: {
      preferredExternalPort: 50002,
      alpn: null,
      addXForwardedHeaders: false,
      auth: null,
    },
    preferredExternalPort: 50002,
    secure: null,
  })

  const electrum = sdk.createInterface(effects, {
    name: i18n('Electrum (SSL)'),
    id: 'electrum',
    description: i18n('Electrum server endpoint'),
    type: 'api',
    schemeOverride: null,
    masked: false,
    username: null,
    path: '',
    query: {},
  })

  const electrumReceipt = await electrumMultiOrigin.export([electrum])

  return [electrumReceipt]
})
