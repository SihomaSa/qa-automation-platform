// cucumber.config.cjs  — CommonJS so Cucumber can load it without extra flags
// This replaces cucumber.config.ts and works on Windows/Mac/Linux

const common = {
  require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
  requireModule: ['ts-node/register', 'tsconfig-paths/register'],
  format: [
    'progress-bar',
    'allure-cucumberjs/reporter',
  ],
  formatOptions: {
    resultsDir: 'allure-results',
    // links: {                               // ← Comenta o elimina todo esto
    //   issue: { pattern: 'https://github.com/your-org/your-repo/issues/{}' },
    // },
  },
};

module.exports = {
  default: common,          // fallback when no --profile is given
  e2e: {
    ...common,
    paths: ['src/features/e2e/**/*.feature'],
    worldParameters: { suite: 'e2e' },
  },
  api: {
    ...common,
    paths: ['src/features/api/**/*.feature'],
    worldParameters: { suite: 'api' },
  },
  all: {
    ...common,
    paths: ['src/features/**/*.feature'],
    worldParameters: { suite: 'all' },
  },
}
