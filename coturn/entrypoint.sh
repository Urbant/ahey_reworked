#!/bin/sh
set -eu
set -- -c /etc/coturn/turnserver.conf --realm="${TURN_HOST:?TURN_HOST required}" --static-auth-secret="${TURN_SECRET:?TURN_SECRET required}"
if [ -n "${EXTERNAL_IP:-}" ]; then set -- "$@" --external-ip="$EXTERNAL_IP"; fi
if [ -n "${TLS_CERT:-}" ] && [ -n "${TLS_KEY:-}" ]; then
 set -- "$@" --cert="$TLS_CERT" --pkey="$TLS_KEY"
else
 set -- "$@" --no-tls --no-dtls
fi
exec turnserver "$@"
