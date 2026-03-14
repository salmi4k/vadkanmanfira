const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONTENT_PACK_ENV_KEY = 'REACT_APP_CONTENT_PACK';

function normalizeContentPack(value) {
  return value === 'team' ? 'team' : 'public';
}

function getActiveContentPack() {
  return normalizeContentPack(process.env[CONTENT_PACK_ENV_KEY]);
}

const PACK_BRANDING = {
  public: {
    appName: 'Vad kan man fira?',
    appDescription:
      'Vad kan man fira? avgör om dagen förtjänar flaggor, bakverk, högtidston eller bara ett torrt konstaterande av kalenderns begränsningar.',
    shortName: 'VKMF',
    themeColor: '#9d4b17',
    backgroundColor: '#f2ecda',
    iconSourcePath: path.resolve(__dirname, '..', 'src', 'vkmf-logo-public.png'),
  },
  team: {
    appName: 'Fredagskoll',
    appDescription:
      'Fredagskoll avgör om dagen förtjänar intern kontorsmytologi, högtidston eller ett torrt konstaterande av kalenderns begränsningar.',
    shortName: 'Mojo',
    themeColor: '#16321f',
    backgroundColor: '#f2ecda',
    iconSourcePath: path.resolve(__dirname, '..', 'src', 'mojo-logo.png'),
  },
};

function getEnvSha() {
  const candidates = [
    process.env.GITHUB_SHA,
    process.env.SOURCE_VERSION,
    process.env.BUILD_SOURCEVERSION,
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.COMMIT_REF,
  ];

  const match = candidates.find((value) => typeof value === 'string' && value.trim().length > 0);
  return match ? match.trim().slice(0, 7) : null;
}

function getBuildRef() {
  const envSha = getEnvSha();
  if (envSha) {
    return envSha;
  }

  const runNumber = process.env.GITHUB_RUN_NUMBER || process.env.BUILD_BUILDID;
  if (typeof runNumber === 'string' && runNumber.trim().length > 0) {
    return `run-${runNumber.trim()}`;
  }

  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: path.resolve(__dirname, '..', '..'),
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return 'local-build';
  }
}

function getGitSha() {
  return getEnvSha() ?? getBuildRef();
}

function ensureDirectoryFor(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeFile(targetPath, contents) {
  ensureDirectoryFor(targetPath);
  fs.writeFileSync(targetPath, contents, 'utf8');
}

function copyFile(sourcePath, targetPath) {
  ensureDirectoryFor(targetPath);
  fs.copyFileSync(sourcePath, targetPath);
}

function createFaviconSvg(branding) {
  const logoBuffer = fs.readFileSync(branding.iconSourcePath);
  const logoBase64 = logoBuffer.toString('base64');

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">',
    `  <rect width="64" height="64" rx="14" fill="${branding.backgroundColor}"/>`,
    `  <rect x="2" y="2" width="60" height="60" rx="12" fill="${branding.themeColor}" opacity="0.08"/>`,
    `  <image href="data:image/png;base64,${logoBase64}" x="8" y="8" width="48" height="48" preserveAspectRatio="xMidYMid meet"/>`,
    '</svg>',
    '',
  ].join('\n');
}

function writeBrowserBranding(contentPack) {
  const branding = PACK_BRANDING[contentPack];
  const publicDir = path.resolve(__dirname, '..', 'public');
  const manifestPath = path.resolve(publicDir, 'manifest.json');
  const indexPath = path.resolve(publicDir, 'index.html');
  const logo192Path = path.resolve(publicDir, 'logo192.png');
  const logo512Path = path.resolve(publicDir, 'logo512.png');
  const faviconSvgPath = path.resolve(publicDir, 'favicon.svg');

  copyFile(branding.iconSourcePath, logo512Path);
  copyFile(branding.iconSourcePath, logo192Path);
  writeFile(faviconSvgPath, createFaviconSvg(branding));

  const manifest = {
    short_name: branding.shortName,
    name: branding.appName,
    icons: [
      {
        src: 'favicon.svg',
        sizes: '64x64',
        type: 'image/svg+xml',
      },
      {
        src: 'logo192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: 'logo512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    start_url: '.',
    display: 'standalone',
    theme_color: branding.themeColor,
    background_color: branding.backgroundColor,
  };

  const indexHtml = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '  <head>',
    '    <meta charset="utf-8" />',
    '    <link rel="icon" type="image/svg+xml" href="%PUBLIC_URL%/favicon.svg" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    `    <meta name="theme-color" content="${branding.themeColor}" />`,
    '    <meta',
    '      name="description"',
    `      content="${branding.appDescription}"`,
    '    />',
    '    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />',
    '    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />',
    `    <title>${branding.appName}</title>`,
    '  </head>',
    '  <body>',
    '    <noscript>You need to enable JavaScript to run this app.</noscript>',
    '    <div id="root"></div>',
    '  </body>',
    '</html>',
    '',
  ].join('\n');

  writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  writeFile(indexPath, indexHtml);
}

const buildInfo = {
  version: require('../package.json').version,
  gitSha: getGitSha(),
  buildRef: getBuildRef(),
  builtAt: new Date().toISOString(),
};

const output = `export const buildInfo = ${JSON.stringify(buildInfo, null, 2)} as const;\n`;
const targetPath = path.resolve(__dirname, '..', 'src', 'buildInfo.generated.ts');
const contentPack = getActiveContentPack();

fs.writeFileSync(targetPath, output, 'utf8');
console.log(`Wrote build info to ${targetPath}`);
writeBrowserBranding(contentPack);
console.log(`Wrote browser branding for ${contentPack} pack`);
