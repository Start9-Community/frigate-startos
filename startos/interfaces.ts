import { sdk } from './sdk'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const electrumMulti = sdk.MultiHost.of(effects, 'electrum')
  const electrumMultiOrigin = await electrumMulti.bindPort(57001, {
    protocol: null,
    addSsl: { preferredExternalPort: 57002, alpn: null },
    preferredExternalPort: 57001,
    secure: null,
  })

  const electrum = sdk.createInterface(effects, {
    name: 'Electrum',
    id: 'electrum',
    description: 'Electrum server endpoint',
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
