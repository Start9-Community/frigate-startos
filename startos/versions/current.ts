import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const FRIGATE_VERSION = '1.5.3.3'

export const current = VersionInfo.of({
  version: '1.5.3:7',
  releaseNotes: {
    en_US:
      'Prevents unnecessary Frigate restarts while Bitcoin Core is shutting down.',
    es_ES:
      'Evita reinicios innecesarios de Frigate mientras Bitcoin Core se está apagando.',
    de_DE:
      'Verhindert unnötige Frigate-Neustarts beim Herunterfahren von Bitcoin Core.',
    pl_PL:
      'Zapobiega niepotrzebnym restartom Frigate podczas wyłączania Bitcoin Core.',
    fr_FR:
      "Évite les redémarrages inutiles de Frigate pendant l'arrêt de Bitcoin Core.",
  },
  migrations: {
    up: async ({ effects }) => {
      const { ensureStore } = await import('../fileModels/store.json')
      await ensureStore(effects)
    },
    down: IMPOSSIBLE,
  },
})
