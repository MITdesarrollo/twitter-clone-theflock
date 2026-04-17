import { test, expect } from '@playwright/test';

const timestamp = Date.now();
const testUser = {
  email: `testuser${timestamp}@example.com`,
  username: `user${timestamp}`,
  displayName: 'Test User',
  password: 'SecurePass1',
};

test.describe('Auth Flow', () => {
  test('full register → timeline → logout → login cycle', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/login/);

    await page.getByRole('link', { name: /register/i }).click();
    await page.waitForURL(/\/register/);

    await page.getByPlaceholder('Email').fill(testUser.email);
    await page.getByPlaceholder('Username').fill(testUser.username);
    await page.getByPlaceholder('Display name').fill(testUser.displayName);
    await page.getByPlaceholder(/password/i).fill(testUser.password);
    await page.getByRole('button', { name: /create account/i }).click();

    await page.waitForURL('/');
    await expect(page.getByText(testUser.displayName)).toBeVisible();

    await page.getByRole('button', { name: /logout/i }).click();
    await page.waitForURL(/\/login/);

    await page.getByPlaceholder('Email').fill(testUser.email);
    await page.getByPlaceholder('Password').fill(testUser.password);
    await page
      .getByRole('main')
      .getByRole('button', { name: /sign in/i })
      .click();

    await page.waitForURL('/');
    await expect(page.getByText(testUser.displayName)).toBeVisible();
  });
});
