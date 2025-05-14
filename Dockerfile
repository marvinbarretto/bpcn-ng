# -----------------------
# Base image
# -----------------------
  FROM node:20-alpine AS builder

  WORKDIR /app

  # Install deps
  COPY package.json package-lock.json ./
  RUN npm ci

  # Copy rest of app
  COPY . .

  # Build Angular SSR
  RUN npm run build:ssr

  # -----------------------
  # Runtime image
  # -----------------------
  FROM node:20-alpine AS runner

  WORKDIR /app

  # Copy only dist + deps
  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/node_modules ./node_modules
  COPY --from=builder /app/package.json ./package.json
  COPY --from=builder /app/.env ./

  # Expose port
  EXPOSE 4000

  # Start server
  CMD ["node", "dist/bpcn-ng/server/server.mjs"]
