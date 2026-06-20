import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { name: 'Homepage', path: '/' },
  { name: 'Login', path: '/auth/login' },
  { name: 'Register', path: '/auth/register' },
  { name: 'Contact', path: '/contact' },
];

for (const { name, path } of pages) {
  test(`${name} has no critical accessibility violations @regression`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Log violations for review
    if (results.violations.length > 0) {
      console.log(`A11y violations on ${name}:`);
      results.violations.forEach(v => {
        console.log(`  - ${v.id}: ${v.description} (${v.impact})`);
      });
    }

    // Only fail on critical/serious violations
    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolations).toHaveLength(0);
  });
}