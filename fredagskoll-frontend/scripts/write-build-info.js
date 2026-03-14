const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getGitSha() {
  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: path.resolve(__dirname, '..', '..'),
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return 'unknown';
  }
}

const buildInfo = {
  version: require('../package.json').version,
  gitSha: getGitSha(),
  builtAt: new Date().toISOString(),
};

const output = `export const buildInfo = ${JSON.stringify(buildInfo, null, 2)} as const;\n`;
const targetPath = path.resolve(__dirname, '..', 'src', 'buildInfo.generated.ts');

fs.writeFileSync(targetPath, output, 'utf8');
console.log(`Wrote build info to ${targetPath}`);
