import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const FRIGATE_VERSION = '1.6.1'

export const current = VersionInfo.of({
  version: '1.6.1:1',
  releaseNotes: {
    en_US: `Updates Frigate to 1.6.0. This release adds connection, request, and subscription limits that protect public servers; a more resilient Electrum-backend connection; graceful shutdown; and optional server-health statistics. StartOS keeps its TLS proxy exempt from Frigate’s per-IP limits so your clients continue to work normally. Frigate 1.6.1 fixes a shutdown deadlock.

- Configure Frigate explains each Electrum Server and Compute Backend option, and what the cache and batch sizes change.
- Bitcoin must be at least 28.4:29, 29.4:16, 30.3:16 or 31.1:16, depending on its major version. Bitcoin Knots (pre-RDTS) 29.3:29 or later also works.`,
    es_ES: `Actualiza Frigate a la versión 1.6.0. Esta versión añade límites de conexiones, solicitudes y suscripciones que protegen los servidores públicos; una conexión más resistente con el backend Electrum; apagado ordenado; y estadísticas opcionales del estado del servidor. StartOS mantiene su proxy TLS exento de los límites por IP de Frigate para que tus clientes sigan funcionando normalmente. Frigate 1.6.1 corrige un bloqueo durante el apagado.

- Configurar Frigate explica cada opción de Servidor Electrum y de Motor de cálculo, y qué cambian los tamaños de caché y de lote.
- Bitcoin debe ser al menos la versión 28.4:29, 29.4:16, 30.3:16 o 31.1:16, según su versión principal. También funciona Bitcoin Knots (pre-RDTS) 29.3:29 o posterior.`,
    de_DE: `Aktualisiert Frigate auf 1.6.0. Diese Version ergänzt Verbindungs-, Anfragen- und Abonnementlimits zum Schutz öffentlicher Server, eine robustere Verbindung zum Electrum-Backend, einen geordneten Shutdown und optionale Serverzustandsstatistiken. StartOS nimmt seinen TLS-Proxy von Frigates Limits pro IP aus, damit deine Clients weiterhin normal funktionieren. Frigate 1.6.1 behebt einen Deadlock beim Herunterfahren.

- Frigate konfigurieren erklärt jede Option von Electrum-Server und Rechen-Backend sowie, was Cache- und Batchgröße bewirken.
- Bitcoin muss je nach Hauptversion mindestens 28.4:29, 29.4:16, 30.3:16 oder 31.1:16 sein. Bitcoin Knots (pre-RDTS) ab 29.3:29 funktioniert ebenfalls.`,
    pl_PL: `Aktualizuje Frigate do wersji 1.6.0. To wydanie dodaje limity połączeń, żądań i subskrypcji chroniące publiczne serwery, bardziej odporną komunikację z backendem Electrum, łagodne zamykanie oraz opcjonalne statystyki stanu serwera. StartOS wyłącza swój proxy TLS z limitów Frigate na adres IP, dzięki czemu klienci nadal działają normalnie. Frigate 1.6.1 naprawia zakleszczenie podczas zamykania.

- Skonfiguruj Frigate wyjaśnia każdą opcję Serwera Electrum i Zaplecza obliczeniowego oraz to, co zmieniają rozmiary pamięci podręcznej i partii.
- Bitcoin musi być co najmniej w wersji 28.4:29, 29.4:16, 30.3:16 lub 31.1:16, zależnie od wersji głównej. Działa też Bitcoin Knots (pre-RDTS) 29.3:29 lub nowszy.`,
    fr_FR: `Met à jour Frigate vers la version 1.6.0. Cette version ajoute des limites de connexions, de requêtes et d’abonnements pour protéger les serveurs publics, une connexion plus robuste au backend Electrum, un arrêt propre et des statistiques optionnelles sur l’état du serveur. StartOS exempte son proxy TLS des limites par IP de Frigate afin que vos clients continuent de fonctionner normalement. Frigate 1.6.1 corrige un blocage à l’arrêt.

- Configurer Frigate explique chaque option de Serveur Electrum et de Moteur de calcul, et ce que changent les tailles de cache et de lot.
- Bitcoin doit être au moins en version 28.4:29, 29.4:16, 30.3:16 ou 31.1:16, selon sa version majeure. Bitcoin Knots (pre-RDTS) 29.3:29 ou plus récent fonctionne aussi.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
