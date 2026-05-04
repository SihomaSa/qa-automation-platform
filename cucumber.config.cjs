// cucumber.config.cjs — CommonJS, works on Windows/Mac/Linux/Node22

const common = {
  require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
  requireModule: ['ts-node/register', 'tsconfig-paths/register'],
  format: [
    'progress-bar',
    // Correct syntax for Node 22 ESM-safe formatters:
    // use ['formatter', 'output-path'] tuple — NOT 'formatter:path' string
    ['@cucumber/pretty-formatter'],
    ['json', 'reports/cucumber-report.json'],
    ['html', 'reports/cucumber-report.html'],
  ],
  // publishQuiet deprecated — removed
}

module.exports = {
  default: common,
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
