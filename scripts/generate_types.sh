#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  echo "Loading environment variables from .env file..."
  set -a
  source .env
  set +a
fi

# Check if SUPABASE_PROJECT_ID environment variable is set
if [ -z "$SUPABASE_PROJECT_ID" ]; then
  echo "Error: SUPABASE_PROJECT_ID environment variable is not set."
  echo "Please set it using: export SUPABASE_PROJECT_ID=your_project_id"
  echo "Or add it to your .env file as: SUPABASE_PROJECT_ID=your_project_id"
  exit 1
fi

# Check if SUPABASE_ACCESS_TOKEN environment variable is set
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "Error: SUPABASE_ACCESS_TOKEN environment variable is not set."
  echo "Please set it using: export SUPABASE_ACCESS_TOKEN=your_access_token"
  echo "Or add it to your .env file as: SUPABASE_ACCESS_TOKEN=your_access_token"
  exit 1
fi

# Show which project ID is being used
echo "Using Supabase Project ID: ${SUPABASE_PROJECT_ID}"

# Generate TypeScript types
echo "Generating TypeScript types from Supabase schema..."
npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID --schema public > src/types/supabase.ts

# Check if the file was generated successfully
if [ $? -eq 0 ]; then
  echo "✅ TypeScript types generated successfully at src/types/supabase.ts"
else
  echo "❌ Failed to generate TypeScript types"
  exit 1
fi

echo "Done!" 