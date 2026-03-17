import fs from 'node:fs';
import path from 'node:path';
import { releaseNotes } from '../src/releaseNotes';

const projectRoot = path.resolve(__dirname, '..', '..');
const outputPath = path.resolve(projectRoot, 'docs', 'release-notes.md');

const sections = releaseNotes.map((note) =>
  [
    `## v${note.version}`,
    '',
    `- SV: ${note.shortSummary.sv}`,
    `- EN: ${note.shortSummary.en}`,
    `- PT-BR: ${note.shortSummary['pt-BR']}`,
    '',
    '### Summary',
    '',
    `- SV: ${note.summary.sv}`,
    `- EN: ${note.summary.en}`,
    `- PT-BR: ${note.summary['pt-BR']}`,
  ].join('\n')
);

const contents = [
  '# Release Notes',
  '',
  'Developer-owned release log for Fredagskoll and Vad kan man fira?.',
  'This file is exported from `fredagskoll-frontend/src/releaseNotes.ts` and can be reused for changelog publishing.',
  '',
  ...sections,
  '',
].join('\n');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, contents, 'utf8');
console.log(`Wrote release notes to ${outputPath}`);
