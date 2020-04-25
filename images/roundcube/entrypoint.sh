#!/bin/bash
set -euo pipefail

ROUNDCUBE_ENIGMA_PGP_HOMEDIR=${ROUNDCUBE_ENIGMA_PGP_HOMEDIR:-}

# gomplate is installed in base image
gomplate --input-dir /_etc/ --output-dir /etc

mkdir -p "$ROUNDCUBEMAIL_DB_DIR" "$ROUNDCUBE_TEMP_DIR"

# fix permissions
chown -R apache:apache \
  /etc/roundcube \
  "$ROUNDCUBEMAIL_DB_DIR" \
  "$ROUNDCUBE_TEMP_DIR"

if [ -n "${ROUNDCUBE_ENIGMA_PGP_HOMEDIR}" ]; then
    mkdir -p "$ROUNDCUBE_ENIGMA_PGP_HOMEDIR"
    chown -R apache:apache  "$ROUNDCUBE_ENIGMA_PGP_HOMEDIR"
fi

php-fpm -D
exec "$@"