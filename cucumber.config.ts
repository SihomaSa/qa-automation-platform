import { IConfiguration } from '@cucumber/cucumber'

const common: Partial<IConfiguration> = {
  require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
  requireModule: ['ts-node/register'],
  format: [
    'progress-bar',
    'allure-cucumberjs/reporter',
    ['json:reports/cucumber-report.json'],
    '@cucumber/html-formatter',     // ← nuevo formateador
  ],
  formatOptions: {
    output: 'reports/cucumber-report.html',   // ← para el HTML
    resultsDir: 'allure-results',
    links: {
      issue: { pattern: 'https://github.com/your-org/your-repo/issues/{}' },
    },
  },
  // publishQuiet: true,   // ← elimínalo (ya no es necesario)
}

export default {
  e2e: { ...common, paths: ['src/features/e2e/**/*.feature'], worldParameters: { suite: 'e2e' } },
  api: { ...common, paths: ['src/features/api/**/*.feature'], worldParameters: { suite: 'api' } },
  all: { ...common, paths: ['src/features/**/*.feature'], worldParameters: { suite: 'all' } },
} satisfies Record<string, Partial<IConfiguration>>