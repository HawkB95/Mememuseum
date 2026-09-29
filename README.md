# Mememuseum

Mememuseum è un progetto full-stack composto da:

- frontend Angular
- backend Express con SQLite
- test end-to-end con Playwright

## Requisiti

- Node.js 20+
- npm

## Avvio locale

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Build frontend per GitHub Pages

Il frontend Angular viene compilato con:

```bash
cd frontend
npm run build
```

La build prodotta i file statici in `frontend/dist/frontend/browser`.

## Pubblicazione su GitHub Pages

1. Crea un nuovo repository GitHub.
2. Connetti il repository locale:

```bash
git remote remove origin
git remote add origin https://github.com/<tuo-username>/<nome-repo>.git
git branch -M master
git push -u origin master
```

3. Vai su GitHub → Settings → Pages.
4. Imposta Source su "GitHub Actions".
5. Il workflow presente in `.github/workflows/deploy-pages.yml` costruirà e pubblicherà automaticamente il sito.

> Nota: GitHub Pages può ospitare solo il frontend statico. Il backend Express e il database SQLite devono essere ospitati separatamente.
