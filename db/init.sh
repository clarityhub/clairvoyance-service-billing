#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE "clairvoyance_billing_development";
  CREATE DATABASE "clairvoyance_billing_test";

  GRANT ALL PRIVILEGES ON DATABASE clairvoyance_billing_development to postgres;
  GRANT ALL PRIVILEGES ON DATABASE clairvoyance_billing_test to postgres;
EOSQL
