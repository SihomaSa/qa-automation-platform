import { IConfiguration } from '@cucumber/cucumber'

const common: Partial<IConfiguration> = {
  require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
  requireModule: ['ts-node/register'],
  format: [
    'progress-bar',
    'allure-cucumberjs/reporter',
    ['json:reports/cucumber-report.json'],
    ['html:reports/cucumber-report.html'],
  ],
  formatOptions: {
    resultsDir: 'allure-results',
    links: {
      issue: { pattern: 'https://github.com/your-org/your-repo/issues/{}' },
    },
  },
  publishQuiet: true,
}

export default {
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
} satisfies Record<string, Partial<IConfiguration>>
