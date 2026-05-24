/**
 * Tests for playwright.config.js
 *
 * Verifies the playwright configuration has the expected values
 * for test directory, browser settings, and web server setup.
 */

// Mock @playwright/test to allow loading playwright.config.js in Jest
jest.mock('@playwright/test', () => ({
  defineConfig: (config) => config,
}));

describe('playwright.config.js', () => {
  let config;

  beforeAll(() => {
    config = require('../playwright.config.js');
  });

  it('sets testDir to ./tests', () => {
    expect(config.testDir).toBe('./tests');
  });

  it('configures headless mode', () => {
    expect(config.use).toBeDefined();
    expect(config.use.headless).toBe(true);
  });

  it('configures a webServer section', () => {
    expect(config.webServer).toBeDefined();
  });

  it('webServer command serves the example build', () => {
    expect(config.webServer.command).toContain('example/build');
  });

  it('webServer command includes port 3000', () => {
    expect(config.webServer.command).toContain('3000');
  });

  it('webServer port is 3000', () => {
    expect(config.webServer.port).toBe(3000);
  });

  it('webServer timeout is 120 seconds', () => {
    expect(config.webServer.timeout).toBe(120 * 1000);
  });

  it('webServer reuseExistingServer is true when CI is not set', () => {
    const originalCI = process.env.CI;
    delete process.env.CI;
    jest.resetModules();
    const freshConfig = require('../playwright.config.js');
    expect(freshConfig.webServer.reuseExistingServer).toBe(true);
    if (originalCI !== undefined) {
      process.env.CI = originalCI;
    }
  });

  it('webServer reuseExistingServer is false when CI is set', () => {
    const originalCI = process.env.CI;
    process.env.CI = 'true';
    jest.resetModules();
    const freshConfig = require('../playwright.config.js');
    expect(freshConfig.webServer.reuseExistingServer).toBe(false);
    if (originalCI !== undefined) {
      process.env.CI = originalCI;
    } else {
      delete process.env.CI;
    }
  });
});
