#!/bin/bash

echo "🚀 Starting AnkiFlow setup..."
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ $NODE_VERSION -lt 16 ]; then
    echo "❌ Node.js version is lower than required. Please upgrade to Node.js v16 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm (v7 or higher) first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi
echo "✅ Dependencies installed successfully."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file..."
    cp .env.example .env 2>/dev/null || touch .env
    echo "VITE_SUPABASE_URL=your_supabase_url" >> .env
    echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env
    echo "SUPABASE_PROJECT_ID=your_project_id" >> .env
    echo "SUPABASE_ACCESS_TOKEN=your_access_token" >> .env
    echo "✅ .env file created. Please update it with your Supabase credentials."
else
    echo "✅ .env file already exists."
fi

# Make generate_types.sh executable
chmod +x scripts/generate_types.sh

# Check if Supabase credentials are set
echo "⚠️ NOTE: Before running the application, you need to:"
echo "  1. Create a Supabase project at https://supabase.com"
echo "  2. Update the .env file with your Supabase credentials"
echo "  3. Run the SQL scripts in scripts/create_db_schema.sql and scripts/seed_data.sql in the Supabase SQL editor"
echo "  4. Generate TypeScript types using ./scripts/generate_types.sh"

echo "=============================="
echo "✅ Setup completed successfully!"
echo "🎮 Run 'npm run dev' to start the development server." 