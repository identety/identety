FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tools ./tools
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Add the entrypoint script
COPY ./start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose application port
EXPOSE 3000

# Use the entrypoint script
ENTRYPOINT ["sh", "/app/start.sh"]
