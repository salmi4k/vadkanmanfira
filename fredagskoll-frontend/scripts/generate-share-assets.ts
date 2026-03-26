import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTENT_PACK_ENV_KEY, normalizeContentPack } from '../src/contentPack';
import { getCelebrationDefinitions } from '../src/features/celebrations/celebrationDefinitions';
import { getShareCatalogEntry } from '../src/features/shareability/shareCatalog';
import { findUpcomingCelebrationDate, getSharePreviewQuery } from '../src/features/shareability/shareability';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteOrigin = (process.env.VITE_SITE_ORIGIN ?? 'http://localhost:3000').replace(/\/+$/, '');
const contentPack = normalizeContentPack(process.env[CONTENT_PACK_ENV_KEY]);
const projectRoot = path.resolve(__dirname, '..');
const publicRoot = path.resolve(projectRoot, 'public');
const cardDir = path.resolve(publicRoot, 'share', 'cards');
const pageRoot = path.resolve(publicRoot, 'share');
const manifestDir = path.resolve(publicRoot, 'generated');
const buildDate = new Date();

type SharePageManifestEntry = {
  slug: string;
  dayType: string;
  label: string;
  url: string;
  cardUrl: string;
  appHref: string;
};

function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath: string, contents: string) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, contents, 'utf8');
}

function toIsoDate(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function createShareCardSvg(args: {
  badge: string;
  label: string;
  nextDate: string;
  accentColor: string;
  backgroundColor: string;
  highlightColor: string;
}) {
  const { accentColor, backgroundColor, badge, highlightColor, label, nextDate } = args;
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">',
    '  <defs>',
    '    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">',
    `      <stop offset="0%" stop-color="${backgroundColor}" />`,
    `      <stop offset="100%" stop-color="${accentColor}" />`,
    '    </linearGradient>',
    '  </defs>',
    `  <rect width="1200" height="630" fill="url(#bg)" rx="38" />`,
    `  <circle cx="1030" cy="132" r="138" fill="${highlightColor}" opacity="0.18" />`,
    `  <circle cx="160" cy="538" r="188" fill="${highlightColor}" opacity="0.08" />`,
    '  <title id="title">Vad kan man fira?</title>',
    `  <desc id="desc">${label} • ${badge} • ${nextDate}</desc>`,
    `  <text x="84" y="116" fill="${highlightColor}" font-size="28" font-family="Georgia, serif" letter-spacing="4">VAD KAN MAN FIRA?</text>`,
    `  <text x="84" y="210" fill="#fff7ef" font-size="72" font-weight="700" font-family="Georgia, serif">${label}</text>`,
    `  <rect x="84" y="260" width="356" height="56" rx="28" fill="${highlightColor}" opacity="0.22" />`,
    `  <text x="112" y="296" fill="#fff7ef" font-size="28" font-family="system-ui, sans-serif">${badge}</text>`,
    `  <text x="84" y="396" fill="#fff7ef" font-size="34" font-family="system-ui, sans-serif">Nästa gång: ${nextDate}</text>`,
    '  <text x="84" y="468" fill="#fff7ef" opacity="0.88" font-size="28" font-family="system-ui, sans-serif">Kalendern, nu i bättre socialt format.</text>',
    '  <text x="84" y="564" fill="#fff7ef" opacity="0.72" font-size="24" font-family="system-ui, sans-serif">vadkanmanfira • svensk kalenderlogik</text>',
    '</svg>',
    '',
  ].join('\n');
}

function createSharePageHtml(args: {
  badge: string;
  cardUrl: string;
  label: string;
  nextDate: string;
  previewUrl: string;
}) {
  const { badge, cardUrl, label, nextDate, previewUrl } = args;
  const title = `Vad kan man fira? | ${label}`;
  const description = `${label} får en egen delningssida med förhandskort, länkpreview och en genväg tillbaka till appen.`;
  const appHref = `${siteOrigin}${previewUrl}`;

  return [
    '<!DOCTYPE html>',
    '<html lang="sv">',
    '  <head>',
    '    <meta charset="utf-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    `    <title>${title}</title>`,
    `    <meta name="description" content="${description}" />`,
    '    <meta property="og:type" content="website" />',
    `    <meta property="og:title" content="${title}" />`,
    `    <meta property="og:description" content="${description}" />`,
    `    <meta property="og:url" content="${previewUrl}" />`,
    `    <meta property="og:image" content="${cardUrl}" />`,
    '    <meta property="og:image:width" content="1200" />',
    '    <meta property="og:image:height" content="630" />',
    '    <meta name="twitter:card" content="summary_large_image" />',
    `    <meta name="twitter:title" content="${title}" />`,
    `    <meta name="twitter:description" content="${description}" />`,
    `    <meta name="twitter:image" content="${cardUrl}" />`,
    `    <link rel="canonical" href="${previewUrl}" />`,
    '    <style>',
    '      body { font-family: Georgia, serif; background: #15120f; color: #f4eee8; padding: 3rem; margin: 0; }',
    '      main { max-width: 42rem; margin: 0 auto; }',
    '      a { color: #ffd7b5; }',
    '      .badge { display: inline-block; padding: 0.4rem 0.85rem; border-radius: 999px; background: rgba(255,255,255,0.12); }',
    '    </style>',
    '  </head>',
    '  <body>',
    '    <main>',
    `      <p class="badge">${badge}</p>`,
    `      <h1>${label}</h1>`,
    `      <p>Nästa gång i appen: <strong>${nextDate}</strong></p>`,
    '      <p>Den här sidan finns främst för länkförhandsvisningar. För riktig kalenderlogik, språkval och humörstyrd text ska du öppna appen.</p>',
    `      <p><a href="${appHref}">Öppna i appen</a></p>`,
    '    </main>',
    '  </body>',
    '</html>',
    '',
  ].join('\n');
}

const manifest: SharePageManifestEntry[] = [];

for (const definition of getCelebrationDefinitions(contentPack)) {
  const entry = getShareCatalogEntry(definition.dayType);
  const nextDate = findUpcomingCelebrationDate(definition.dayType, buildDate) ?? buildDate;
  const slug = entry.slug;
  const previewUrl = `${siteOrigin}/share/${slug}/`;
  const cardUrl = `${siteOrigin}/share/cards/${slug}.svg`;
  const nextDateLabel = toIsoDate(nextDate);

  writeFile(
    path.resolve(cardDir, `${slug}.svg`),
    createShareCardSvg({
      badge: entry.badge,
      label: entry.label,
      nextDate: nextDateLabel,
      accentColor: entry.accentColor,
      backgroundColor: entry.backgroundColor,
      highlightColor: entry.highlightColor,
    })
  );

  writeFile(
    path.resolve(pageRoot, slug, 'index.html'),
    createSharePageHtml({
      badge: entry.badge,
      cardUrl,
      label: entry.label,
      nextDate: nextDateLabel,
      previewUrl,
    })
  );

  manifest.push({
    slug,
    dayType: definition.dayType,
    label: entry.label,
    url: previewUrl,
    cardUrl,
    appHref: `${siteOrigin}${getSharePreviewQuery(nextDate, definition.dayType)}`,
  });
}

writeFile(path.resolve(manifestDir, 'share-pages.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${manifest.length} share pages for ${contentPack}`);
