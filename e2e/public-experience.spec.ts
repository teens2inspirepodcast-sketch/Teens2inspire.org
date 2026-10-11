import { expect, test } from "@playwright/test";

test("marketing home shows the brand and real membership choices", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Teens2Inspire/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /choose personal/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /choose family/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /for schools/i })).toBeVisible();
});

test("signup honors the selected plan and provides accessible required fields", async ({ page }) => {
  await page.goto("/signup?plan=family");
  await expect(page.getByRole("heading", { name: /make this space yours/i })).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("radio", { name: /family.*9\.99/i })).toBeChecked();
  await expect(page.getByLabel(/at least 13 years old/i)).toBeVisible();
});

test("login and download pages render without requiring a signed-in user", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await page.goto("/download");
  await expect(page.getByRole("heading", { name: /get the teens2inspire app/i })).toBeVisible();
});

test("homepage has no horizontal overflow or emoji UI", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth, text: document.body.innerText }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.text).not.toMatch(/\p{Extended_Pictographic}/u);
});
