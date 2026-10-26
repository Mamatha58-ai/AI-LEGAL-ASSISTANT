# Multi-stage Docker build for LexAI (Client + Server)
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Install server dependencies
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./

# Copy built frontend assets
COPY --from=client-builder /app/client/dist /app/client/dist

EXPOSE 5000
CMD ["node", "server.js"]
