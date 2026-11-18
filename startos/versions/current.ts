import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const FRIGATE_VERSION = '1.6.1'

export const current = VersionInfo.of({
  version: '1.6.1:5',
  releaseNotes: {
    en_US:
      'Requires StartOS 0.4.2 or later. Mitigates Java4Shell (CVE-2026-114938) by disabling the affected Java optimization in all package variants.',
    es_ES:
      'Requiere StartOS 0.4.2 o posterior. Mitiga Java4Shell (CVE-2026-114938) desactivando la optimización de Java afectada en todas las variantes del paquete.',
    de_DE:
      'Erfordert StartOS 0.4.2 oder neuer. Mindert Java4Shell (CVE-2026-114938) durch Deaktivierung der betroffenen Java-Optimierung in allen Paketvarianten.',
    pl_PL:
      'Wymaga StartOS 0.4.2 lub nowszego. Ogranicza Java4Shell (CVE-2026-114938), wyłączając podatną optymalizację Javy we wszystkich wariantach pakietu.',
    fr_FR:
      'Nécessite StartOS 0.4.2 ou une version ultérieure. Atténue Java4Shell (CVE-2026-114938) en désactivant l’optimisation Java concernée dans toutes les variantes du paquet.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
