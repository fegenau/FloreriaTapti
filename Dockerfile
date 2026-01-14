FROM node:20-alpine AS base

# 1. Build Stage
FROM base AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# 2. Runtime Stage
FROM base AS runtime
WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production

COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
