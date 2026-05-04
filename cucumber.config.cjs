// cucumber.config.cjs — CommonJS, Node 22 compatible

const common = {
  require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
  requireModule: ['ts-node/register', 'tsconfig-paths/register'],
  format: [
    'progress-bar',
    ['json', 'reports/cucumber-report.json'],
    ['html', 'reports/cucumber-report.html'],
  ],
  timeout: 60000,   // 60s per step — remote site can be slow
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
