import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const FRIGATE_VERSION = '1.6.1'

export const current = VersionInfo.of({
  version: '1.6.1:5',
  releaseNotes: {
    en_US:
      'Requires StartOS 0.4.2 or later. Mitigates Java4Shell (CVE-2026-114938) on affected x86-64 servers.',
    es_ES:
      'Requiere StartOS 0.4.2 o posterior. Mitiga Java4Shell (CVE-2026-114938) en los servidores x86-64 afectados.',
    de_DE:
      'Erfordert StartOS 0.4.2 oder neuer. Entschärft Java4Shell (CVE-2026-114938) auf betroffenen x86-64-Servern.',
    pl_PL:
      'Wymaga StartOS 0.4.2 lub nowszego. Ogranicza podatność Java4Shell (CVE-2026-114938) na podatnych serwerach x86-64.',
    fr_FR:
      'Nécessite StartOS 0.4.2 ou une version ultérieure. Atténue Java4Shell (CVE-2026-114938) sur les serveurs x86-64 concernés.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
