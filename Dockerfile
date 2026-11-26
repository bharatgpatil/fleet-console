FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/contracts/package.json packages/contracts/
COPY packages/domain/package.json packages/domain/
COPY packages/simulation/package.json packages/simulation/
COPY apps/server/package.json apps/server/
COPY apps/simulator/package.json apps/simulator/
COPY apps/web/package.json apps/web/
RUN npm ci

COPY . .
RUN npm run build

ENV PORT=8080     SERVER_URL=http://localhost:8080     WEB_ROOT=/app/apps/web/dist     LOG_LEVEL=info

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s CMD wget -qO- http://localhost:8080/healthz || exit 1

CMD ["npm", "run", "serve"]
