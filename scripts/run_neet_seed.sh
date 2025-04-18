#!/bin/bash

# Define variables
ENV_FILE=".env.local"

# Check if .env.local exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found!"
  exit 1
fi

# Source variables from .env.local
source "$ENV_FILE"

# Check if required variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: Supabase URL or service role key not set in $ENV_FILE!"
  exit 1
fi

# Extract database URL from Supabase URL
SUPABASE_HOST=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's|^https\?://||' | sed 's|/.*$||')
DATABASE_URL="postgresql://postgres:${SUPABASE_SERVICE_ROLE_KEY}@db.${SUPABASE_HOST}:5432/postgres"

echo "Running NEET seed data script against Supabase..."

# Run the seed script using psql
psql "$DATABASE_URL" -f scripts/neet_seed.sql

echo "Seed completed!" 