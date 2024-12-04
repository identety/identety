#!/bin/sh
set -e

# Navigate to tools directory for database migration
echo "Migrating database..."
cd tools && npm install

# Generate and run database migrations
npx drizzle-kit generate
npx drizzle-kit migrate
cd .. # Back to app root


# Navigate back to app root and start the application
echo "Starting application..."
exec node dist/main
