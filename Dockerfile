# syntax=docker/dockerfile:1

FROM node:18-alpine AS base
WORKDIR /app

# Install OS-level dependencies for PDF/image tools
RUN apk add --no-cache \
    graphicsmagick \
    ghostscript \
    fontconfig \
    ttf-dejavu \
    bash \
    libc6-compat

# -- Step 1: Install dependencies only when needed
FROM base AS deps

COPY package.json ./
COPY package-lock.json ./

RUN npm i --legacy-peer-deps

# -- Step 2: Build the application
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

COPY src/prisma ./src/prisma

# Generate Prisma client before build
RUN npx prisma generate

RUN npm run build

# -- Step 3: Create the production image
FROM base AS runner

# Set environment vars
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# Copy build artifacts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ensure correct file ownership
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
