#!/bin/sh
set -eu

# Runs only when PostgreSQL initializes an empty data volume.
# Keep the application login separate from the database administrator.
psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  --set=ON_ERROR_STOP=1 \
  --set=app_password="$APP_DB_PASSWORD" \
  --set=db_name="$POSTGRES_DB" <<'SQL'
CREATE ROLE diary_app LOGIN PASSWORD :'app_password'
  NOSUPERUSER NOCREATEDB NOCREATEROLE;
GRANT CONNECT ON DATABASE :"db_name" TO diary_app;
SQL
