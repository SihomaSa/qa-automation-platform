# ---- Base image with Node + Playwright browsers ----
FROM mcr.microsoft.com/playwright:v1.41.2-jammy AS base

WORKDIR /app

# Copy dependency files first (layer cache)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# ---- Test runner ----
FROM base AS test-runner

# Default env — override with docker run -e or docker-compose
ENV HEADLESS=true \
    BROWSER=chromium \
    BASE_URL=https://automationexercise.com \
    API_BASE_URL=https://automationexercise.com/api \
    SCREENSHOT_ON_FAIL=true

# Reports output (mount a volume here in CI)
VOLUME ["/app/reports", "/app/allure-results"]

ENTRYPOINT ["npm", "run"]
CMD ["test:all"]
