#FROM node:20-alpine AS builder
#
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#
#COPY . .
#RUN npm run build
#
#FROM node:20-alpine AS production
#
#WORKDIR /app
#COPY --from=builder /app/dist ./dist
#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/package*.json ./
#
#ENV NODE_ENV=production
#
#EXPOSE 3000
#CMD ["node", "dist/main"]

# Stage 1: Build the app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .
RUN npm run build

# Stage 2: Production setup
FROM node:20-alpine AS production

WORKDIR /app

# Copy build artifacts and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy the tools folder for migrations
COPY --from=builder /app/tools ./tools

# Set environment to production
ENV NODE_ENV=production

# Expose application port
EXPOSE 3000

# Run migrations and start the app
CMD ["sh", "-c", "cd tools && npm install && npx drizzle-kit generate && npx drizzle-kit migrate && cd .. && node dist/main"]
