import { test, expect, Page } from '@playwright/test';
import path from 'path';

const TEST_USER = {
  username: 'testuser',
  email: 'testuser@example.com',
  password: 'password123'
};

const TEST_MEME = {
  title: 'Meme di Test E2E',
  tags: 'test, playwright, e2e'
};

const TEST_IMAGE_PATH = path.join(__dirname, 'img-test-fold', 'img-test.jpg');

// Helper per Login
async function loginUser(page: Page) {
  await page.goto('/login');
  await page.getByPlaceholder('Inserisci username').fill(TEST_USER.username);
  await page.getByPlaceholder('Inserisci password').fill(TEST_USER.password);
  await page.getByRole('button', { name: 'Accedi' }).click();
  await expect(page.locator('.navbar')).toContainText(TEST_USER.username, { timeout: 10000 });
}


test('1 - CARICAMENTO HOME PAGE', async ({ page }) => {
  await page.goto('/home');

  await expect(page.getByText('Tag')).toBeVisible();
  await expect(page.getByPlaceholder('es: divertente')).toBeVisible();
  await expect(page.getByText('Ordina per:')).toBeVisible();
  await expect(page.getByText('MEMEMUSEUM')).toBeVisible();
});

test('2 - REGISTRAZIONE', async ({ page }) => {
  await page.goto('/register');

  await expect(page.getByRole('heading', { name: 'Registrazione' })).toBeVisible();

  await page.getByPlaceholder('Username').fill(TEST_USER.username);
  await page.getByPlaceholder('Email').fill(TEST_USER.email);
  await page.getByPlaceholder('Password').fill(TEST_USER.password);

  await page.getByRole('button', { name: 'Registrati' }).click();

  await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
});

test('3 - LOGIN (CREDENZIALI VALIDE)', async ({ page }) => {
  await page.goto('/login');

  await page.getByPlaceholder('Inserisci username').fill(TEST_USER.username);
  await page.getByPlaceholder('Inserisci password').fill(TEST_USER.password);

  await page.getByRole('button', { name: 'Accedi' }).click();

  await expect(page.locator('.navbar')).toContainText(TEST_USER.username, { timeout: 10000 });
  await expect(page.getByText('Logout')).toBeVisible();
  await expect(page.getByText('Carica')).toBeVisible();
});

test('4 - LOGIN (CREDENZIALI ERRATE)', async ({ page }) => {
  await page.goto('/login');

  await page.getByPlaceholder('Inserisci username').fill(TEST_USER.username);
  await page.getByPlaceholder('Inserisci password').fill('passwordsbagliata');

  await page.getByRole('button', { name: 'Accedi' }).click();

  await expect(page.locator('.alert-danger')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.navbar')).not.toContainText(TEST_USER.username);
});

test('5 - REDIRECT A LOGIN (NON AUTENTICATO PER UPLOAD)', async ({ page }) => {
  await page.goto('/upload');

  await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});

test('6 - UPLOAD MEME', async ({ page }) => {
  await loginUser(page);

  await page.getByRole('link', { name: 'Carica' }).click();

  await expect(page.getByRole('heading', { name: 'Carica un Meme' })).toBeVisible();

  await page.getByPlaceholder('Dai un titolo al tuo meme').fill(TEST_MEME.title);

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(TEST_IMAGE_PATH);

  await page.getByPlaceholder('divertente, gatti, programmazione').fill(TEST_MEME.tags);

  await page.getByRole('button', { name: 'Carica Meme' }).click();

  await expect(page.getByText(TEST_MEME.title)).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.badge').filter({ hasText: 'test' }).first()).toBeVisible();
  await expect(page.locator('.badge').filter({ hasText: 'playwright' }).first()).toBeVisible();
  await expect(page.locator('.badge').filter({ hasText: 'e2e' }).first()).toBeVisible();
});

test('7 - PAGINA DETTAGLIO MEME', async ({ page }) => {
  await page.goto('/home');

  await expect(page.locator('.meme-card').first()).toBeVisible({ timeout: 10000 });

  await page.locator('.meme-card').first().click();

  await expect(page).toHaveURL(/\/meme\/\d+/);
  await expect(page.getByText('Commenti')).toBeVisible();
});

test('8 - UPVOTE (AUTENTICATO)', async ({ page }) => {
  await loginUser(page);

  await page.goto('/home');
  await expect(page.locator('.meme-card').first()).toBeVisible({ timeout: 10000 });

  await page.locator('.meme-card').first().click();
  await expect(page).toHaveURL(/\/meme\/\d+/);

  const upvoteButton = page.locator('button', { hasText: '▲' });
  await expect(upvoteButton).toBeEnabled();

  await upvoteButton.click();
  await expect(upvoteButton).toHaveClass(/btn-success/, { timeout: 5000 });
});

test('9 - AGGIUNTA COMMENTO (AUTENTICATO)', async ({ page }) => {
  await loginUser(page);

  await page.goto('/home');
  await expect(page.locator('.meme-card').first()).toBeVisible({ timeout: 10000 });

  await page.locator('.meme-card').first().click();
  await expect(page).toHaveURL(/\/meme\/\d+/);

  const commentText = 'Commento di test Playwright';

  await page.getByPlaceholder('Scrivi un commento...').fill(commentText);
  await page.getByRole('button', { name: 'Commenta' }).click();

  await expect(page.getByText(commentText)).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('strong').filter({ hasText: TEST_USER.username }).first()).toBeVisible();
});

test('10 - FUNZIONAMENTO FILTRO PER TAG', async ({ page }) => {
  await page.goto('/home');

  await expect(page.getByPlaceholder('es: divertente')).toBeVisible();

  await page.getByPlaceholder('es: divertente').fill('test');
  await page.getByRole('button', { name: 'Cerca' }).click();


  await expect(page.locator('.meme-card').first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('test').first()).toBeVisible();

  await page.getByPlaceholder('es: divertente').fill('taginesistente123');
  await page.getByRole('button', { name: 'Cerca' }).click();

  await expect(page.getByText('Nessun meme trovato')).toBeVisible({ timeout: 10000 });
});