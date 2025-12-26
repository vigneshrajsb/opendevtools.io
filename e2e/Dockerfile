FROM mcr.microsoft.com/playwright:v1.57.0-noble

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY e2e/ ./e2e/
COPY playwright.config.ts ./
COPY tsconfig.json ./

CMD ["pnpm", "test:e2e"]
