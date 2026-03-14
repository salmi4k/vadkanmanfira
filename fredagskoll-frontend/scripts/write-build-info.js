const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

const buildInfo = {
  version: require('../package.json').version,
  gitSha: getGitSha(),
  buildRef: getBuildRef(),
  builtAt: new Date().toISOString(),
};

const output = `export const buildInfo = ${JSON.stringify(buildInfo, null, 2)} as const;\n`;
const targetPath = path.resolve(__dirname, '..', 'src', 'buildInfo.generated.ts');

fs.writeFileSync(targetPath, output, 'utf8');
console.log(`Wrote build info to ${targetPath}`);
