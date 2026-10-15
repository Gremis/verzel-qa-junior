import { defineConfig } from '@playwright/test';
import config from './playwright.config';

// Demonstração visual dos mesmos testes; regras e assertions não são alteradas.
export default defineConfig(config, {
  testMatch: 'coupon-shipping.spec.ts',
  timeout: 90_000,
  outputDir: 'test-results/demo/artifacts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-demo-report', open: 'never' }],
    ['json', { outputFile: 'test-results/demo/results.json' }],
  ],
  use: {
    headless: false,
    launchOptions: { slowMo: 1_500 },
    video: 'on',
    trace: 'on',
  },
});
