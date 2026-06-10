// Verificação ponta a ponta no Chrome instalado (sem download de browser):
//   npm i --no-save playwright-core && npm run dev   (em outro terminal)
//   node scripts/verify-map.mjs
import { chromium } from 'playwright-core';

const URL = 'http://localhost:5173';
const out = (n) => `scripts/shot-${n}.png`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', (err) => errors.push(`PAGEERROR: ${err.message}`));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.screenshot({ path: out('1-initial') });

// Busca um livro com muitas traduções
await page.fill('#search-input', 'the little prince');
await page.click('#search-button');
await page.waitForSelector('.book-card', { timeout: 20000 });
await page.screenshot({ path: out('2-results') });

// Seleciona o primeiro resultado (obra canônica, muitos idiomas)
await page.click('.book-card');
await page.waitForSelector('.map-legend', { timeout: 30000 });
// espera o fly-to e o GeoJSON renderizarem
await page.waitForTimeout(3500);
await page.screenshot({ path: out('3-selected') });

// Inspeciona o estado
const state = await page.evaluate(() => {
  const chips = [...document.querySelectorAll('.map-legend-chip')].map((c) => ({
    name: c.querySelector('.map-legend-name')?.textContent,
    count: c.querySelector('.map-legend-count')?.textContent,
  }));
  const painted = [...document.querySelectorAll('path.leaflet-interactive')].filter(
    (p) => p.getAttribute('fill') && p.getAttribute('fill') !== 'transparent'
  );
  const fills = new Set(painted.map((p) => p.getAttribute('fill')));
  return {
    legendTotal: document.querySelector('.map-legend-total')?.textContent,
    chipCount: chips.length,
    chips: chips.slice(0, 8),
    paintedPaths: painted.length,
    distinctFills: [...fills],
    detailChips: [...document.querySelectorAll('.detail-language-chip')].length,
    detailStatus: document.querySelector('.detail-languages-status')?.textContent,
  };
});
console.log(JSON.stringify(state, null, 2));

// Probe: alterna a primeira camada de idioma (ocultar)
const before = await page.evaluate(
  () =>
    document.querySelectorAll(
      'path.leaflet-interactive:not([fill="transparent"])'
    ).length
);
await page.click('.map-legend-chip');
await page.waitForTimeout(800);
const after = await page.evaluate(
  () =>
    document.querySelectorAll(
      'path.leaflet-interactive:not([fill="transparent"])'
    ).length
);
console.log(JSON.stringify({ probeToggle: { paintedBefore: before, paintedAfter: after } }));
await page.screenshot({ path: out('4-toggled') });

// Probe: nova busca limpa o mapa
await page.fill('#search-input', 'xyzzy-livro-inexistente-qqq');
await page.click('#search-button');
await page.waitForTimeout(3000);
const overlay = await page.evaluate(() => ({
  hasOverlay: !!document.querySelector('.map-overlay'),
  hasLegend: !!document.querySelector('.map-legend'),
  errorText: document.querySelector('.error-message .error-text')?.textContent,
}));
console.log(JSON.stringify(overlay));
await page.screenshot({ path: out('5-empty-search') });

console.log('CONSOLE ERRORS:', JSON.stringify(errors));
await browser.close();
