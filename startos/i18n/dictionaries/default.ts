export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Frigate Electrum Server': 1,
  'Frigate is running': 2,
  'Frigate is syncing...': 3,
  'Frigate Sync Progress': 4,
  'Frigate has not yet indexed any blocks': 5,

  // interfaces.ts
  Electrum: 100,
  'Electrum server endpoint': 101,

  // actions/config.ts
  'Configure Frigate': 200,
  'Set or update Frigate configuration settings.': 201,
  'Electrum Server': 202,
  'Electrum Backend Server': 203,
  'Fulcrum (recommended)': 204,
  '(not installed)': 205,
  Electrs: 206,
  'None (not recommended)': 207,
  'Advanced settings': 208,
  'Start Indexing on Launch': 209,
  'Whether Frigate should start indexing the blockchain upon launch.': 210,
  'Index Start Height': 211,
  'The block height from which Frigate should start indexing.': 212,
  'Script PubKey Cache Size': 213,
  'The size of the Script PubKey cache in bytes (default 10,000,000).': 214,
  Configuration: 215,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
