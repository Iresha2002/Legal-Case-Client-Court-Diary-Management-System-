#!/bin/sh
# Development entrypoint for the backend container (used by compose.dev.yaml).
# Runs the app with spring-boot:run and recompiles whenever files under src/main
# change. Spring Boot DevTools sees the new classes and restarts the app.
set -eu

cd /workspace
marker=/tmp/last-compile

sh ./mvnw --batch-mode --no-transfer-progress -DskipTests compile
touch "$marker"

sh ./mvnw --batch-mode --no-transfer-progress -DskipTests spring-boot:run &
app_pid=$!
trap 'kill "$app_pid" 2>/dev/null; exit 0' INT TERM

while kill -0 "$app_pid" 2>/dev/null; do
  sleep 2
  changed=$(find src/main pom.xml -newer "$marker" -type f 2>/dev/null | head -n 1)
  if [ -n "$changed" ]; then
    touch "$marker"
    echo "[dev-watch] Change detected ($changed), recompiling..."
    sh ./mvnw --batch-mode --no-transfer-progress --offline -q -DskipTests compile \
      || echo "[dev-watch] Compile failed; fix the error and save again."
  fi
done

wait "$app_pid"
