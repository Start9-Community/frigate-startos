import { setupManifest } from '@start9labs/start-sdk'
import { FRIGATE_VERSION } from '../versions'

export const manifest = setupManifest({
  id: 'frigate',
  title: 'Frigate Electrum Server',
  license: 'Apache 2.0',
  packageRepo: 'https://github.com/remcoros/frigate-startos',
  upstreamRepo: 'https://github.com/sparrowwallet/frigate',
  supportSite: 'https://github.com/sparrowwallet/frigate/issues',
  marketingUrl: 'https://github.com/sparrowwallet/frigate',
  donationUrl: 'https://sparrowwallet.com/donate/',
  description: {
    short: { en_US: 'Frigate Electrum Server' },
    long: {
      en_US:
        'Frigate is an experimental Electrum Server testing Silent Payments scanning with ephemeral client keys.',
    },
  },
  volumes: ['main'],
  images: {
    main: {
      arch: ['x86_64', 'aarch64'],
      nvidiaContainer: true,
      source: {
        dockerTag: 'ghcr.io/remcoros/frigate-docker:' + FRIGATE_VERSION,
      },
    },
  },
  hardwareAcceleration: true,
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    bitcoind: {
      description: { en_US: 'Used to subscribe to new block events.' },
      optional: false,
      metadata: {
        title: 'A Bitcoin Full Node',
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
    electrs: {
      description: { en_US: 'Electrs Electrum server backend (optional).' },
      optional: true,
      metadata: {
        title: 'Electrs',
        icon: 'https://raw.githubusercontent.com/Start9Labs/electrs-startos/master/icon.svg',
      },
    },
    fulcrum: {
      description: { en_US: 'Fulcrum Electrum server backend (optional).' },
      optional: true,
      metadata: {
        title: 'Fulcrum',
        icon: 'https://raw.githubusercontent.com/Start9Labs/fulcrum-startos/next/icon.png',
      },
    },
  },
})
