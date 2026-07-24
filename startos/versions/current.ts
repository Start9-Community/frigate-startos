import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const FRIGATE_VERSION = '1.5.3.3'

export const current = VersionInfo.of({
  version: '1.5.3:5',
  releaseNotes: {
    en_US:
      'Adds StartOS 0.4.0-beta.10 and Start SDK 2 compatibility with dynamic Bitcoin and Electrum provider routing.',
    es_ES:
      'Añade compatibilidad con StartOS 0.4.0-beta.10 y Start SDK 2 con enrutamiento dinámico de proveedores Bitcoin y Electrum.',
    de_DE:
      'Fügt Kompatibilität mit StartOS 0.4.0-beta.10 und Start SDK 2 sowie dynamisches Routing für Bitcoin- und Electrum-Anbieter hinzu.',
    pl_PL:
      'Dodaje zgodność ze StartOS 0.4.0-beta.10 i Start SDK 2 oraz dynamiczny routing dostawców Bitcoin i Electrum.',
    fr_FR:
      'Ajoute la compatibilité avec StartOS 0.4.0-beta.10 et Start SDK 2 avec routage dynamique des fournisseurs Bitcoin et Electrum.',
  },
  migrations: {
    up: async ({ effects }) => {
      const { ensureStore } = await import('../fileModels/store.json')
      await ensureStore(effects)
    },
    down: IMPOSSIBLE,
  },
})
