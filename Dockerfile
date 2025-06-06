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

COPY package.json package-lock.json ./

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
RUN addgroup --system --gid 1005 deployusers && \
    adduser --system --uid 1001 --ingroup deployusers nextjs

WORKDIR /app

# Copy build artifacts
COPY --from=deps /app/node_modules/pdf-lib ./node_modules/pdf-lib
COPY --from=deps /app/node_modules/@pdf-lib ./node_modules/@pdf-lib
COPY --from=deps /app/node_modules/pako ./node_modules/pako

COPY --from=deps /app/node_modules/pdf2pic ./node_modules/pdf2pic
COPY --from=deps /app/node_modules/debug ./node_modules/debug
COPY --from=deps /app/node_modules/gm ./node_modules/gm
COPY --from=deps /app/node_modules/path-key ./node_modules/path-key
COPY --from=deps /app/node_modules/cross-spawn ./node_modules/cross-spawn
COPY --from=deps /app/node_modules/tslib ./node_modules/tslib
COPY --from=deps /app/node_modules/which ./node_modules/which
COPY --from=deps /app/node_modules/ms ./node_modules/ms
COPY --from=deps /app/node_modules/isexe ./node_modules/isexe
COPY --from=deps /app/node_modules/array-parallel ./node_modules/array-parallel
COPY --from=deps /app/node_modules/array-series ./node_modules/array-series
COPY --from=deps /app/node_modules/shebang-command ./node_modules/shebang-command
COPY --from=deps /app/node_modules/shebang-regex ./node_modules/shebang-regex

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/dist ./dist

# Ensure correct file ownership
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
