import { expect, test } from '@playwright/test';

test.describe('critical journey', () => {
  test('register → create feature → board → advance Idea to Scouting', async ({
    page,
  }) => {
    const stamp = Date.now();
    const email = `e2e.po.${stamp}@example.com`;
    const password = 'password12';
    const title = `E2E board ${stamp}`;

    await page.goto('/register');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Product Owner' }).click();
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto('/features/new');
    await expect(
      page.getByRole('heading', { name: 'New Feature' }),
    ).toBeVisible();
    await page.getByLabel('Title').fill(title);
    await page
      .getByLabel('Problem')
      .fill('Browser E2E needs a real Feature on the board.');
    await page.getByRole('button', { name: 'Create Feature' }).click();
    await expect(page).toHaveURL(/\/features\/\d+/);
    await expect(page.getByRole('heading', { name: title })).toBeVisible();

    await page.goto('/board');
    await expect(page.getByRole('heading', { name: 'Board' })).toBeVisible();
    const idea = page.getByRole('region', { name: 'Idea', exact: true });
    const card = idea.getByRole('article').filter({ hasText: title });
    await expect(card.getByRole('link', { name: title })).toBeVisible();

    await card.getByRole('button', { name: 'Advance to Scouting' }).click();

    const scouting = page.getByRole('region', { name: 'Scouting', exact: true });
    await expect(
      scouting.getByRole('article').filter({ hasText: title }),
    ).toBeVisible();
    await expect(
      idea.getByRole('article').filter({ hasText: title }),
    ).toHaveCount(0);
  });
});
