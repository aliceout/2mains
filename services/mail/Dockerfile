FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev --no-audit --no-fund; \
    fi

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

EXPOSE 3000
USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ > /dev/null 2>&1 || exit 1

CMD ["node", "src/index.js"]
