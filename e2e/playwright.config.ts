/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
import { defineConfig } from '@playwright/test';

// Configurazione di Playwright per i test E2E di MEMEMUSEUM.
// Come indicato nella Lezione 23 (Web Testing), slide 49, Playwright può
// eseguire i test su Chromium, Firefox e WebKit. Per velocità durante lo
// sviluppo, usiamo solo Chromium.

export default defineConfig({
  testDir: './tests',
  
  // Timeout massimo per ogni singolo test (30 secondi)
  timeout: 30000,
  
  // Timeout per le asserzioni expect (5 secondi)
  expect: { timeout: 5000 },
  
  // Esegui i test in sequenza (non in parallelo) perché condividono
  // lo stesso database e i test dipendono dall'ordine di esecuzione
  // (prima registrazione, poi login, poi upload, ecc.)
  fullyParallel: false,
  workers: 1,
  
  // Reporter per i risultati dei test
  reporter: 'html',
  
  use: {
    // URL base dell'applicazione frontend
    baseURL: 'http://localhost:4200',
    
    // Cattura screenshot solo in caso di fallimento del test
    screenshot: 'only-on-failure',
    
    // Registra trace solo al primo tentativo fallito (utile per debug)
    trace: 'on-first-retry',
  },

  // Eseguiamo i test solo su Chromium per semplicità
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});