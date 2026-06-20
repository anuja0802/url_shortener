# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./

USER appuser

EXPOSE 5000

CMD ["node", "src/app.js"]
