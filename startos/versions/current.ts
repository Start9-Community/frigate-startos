import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const FRIGATE_VERSION = '1.6.0'

export const current = VersionInfo.of({
  version: '1.6.0:0',
  releaseNotes: {
    en_US:
      'Updates Frigate to 1.6.0. This release adds connection, request, and subscription limits that protect public servers; a more resilient Electrum-backend connection; graceful shutdown; and optional server-health statistics. StartOS keeps its TLS proxy exempt from Frigate’s per-IP limits so your clients continue to work normally.',
    es_ES:
      'Actualiza Frigate a la versión 1.6.0. Esta versión añade límites de conexiones, solicitudes y suscripciones que protegen los servidores públicos; una conexión más resistente con el backend Electrum; apagado ordenado; y estadísticas opcionales del estado del servidor. StartOS mantiene su proxy TLS exento de los límites por IP de Frigate para que tus clientes sigan funcionando normalmente.',
    de_DE:
      'Aktualisiert Frigate auf 1.6.0. Diese Version ergänzt Verbindungs-, Anfragen- und Abonnementlimits zum Schutz öffentlicher Server, eine robustere Verbindung zum Electrum-Backend, einen geordneten Shutdown und optionale Serverzustandsstatistiken. StartOS nimmt seinen TLS-Proxy von Frigates Limits pro IP aus, damit deine Clients weiterhin normal funktionieren.',
    pl_PL:
      'Aktualizuje Frigate do wersji 1.6.0. To wydanie dodaje limity połączeń, żądań i subskrypcji chroniące publiczne serwery, bardziej odporną komunikację z backendem Electrum, łagodne zamykanie oraz opcjonalne statystyki stanu serwera. StartOS wyłącza swój proxy TLS z limitów Frigate na adres IP, dzięki czemu klienci nadal działają normalnie.',
    fr_FR:
      'Met à jour Frigate vers la version 1.6.0. Cette version ajoute des limites de connexions, de requêtes et d’abonnements pour protéger les serveurs publics, une connexion plus robuste au backend Electrum, un arrêt propre et des statistiques optionnelles sur l’état du serveur. StartOS exempte son proxy TLS des limites par IP de Frigate afin que vos clients continuent de fonctionner normalement.',
  },
  migrations: {
    up: async ({ effects }) => {
      const { ensureStore } = await import('../fileModels/store.json')
      await ensureStore(effects)
    },
    down: IMPOSSIBLE,
  },
})
