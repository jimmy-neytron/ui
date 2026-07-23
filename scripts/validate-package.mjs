import { access, mkdir, readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { runNpm } from './npm-process.mjs';

const root = resolve(import.meta.dirname, '..');
const artifacts = resolve(root, '.artifacts');
const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));

try {
  await access(resolve(root, 'dist/index.js'));
  await access(resolve(root, 'dist/index.d.ts'));
  await access(resolve(root, 'dist/styles.css'));
} catch {
  console.error('dist/ is incomplete. Run npm run build successfully before package validation.');
  process.exit(1);
}

await mkdir(artifacts, { recursive: true });

const result = runNpm(
  ['pack', '--json', '--pack-destination', artifacts],
  { cwd: root, encoding: 'utf8' },
);

if (result.status !== 0) {
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  process.exit(result.status ?? 1);
}

let packResult;
try {
  const parsed = JSON.parse((result.stdout ?? '').trim());
  packResult = parsed[0];
} catch (error) {
  console.error('Unable to parse npm pack --json output.');
  console.error(error);
  process.exit(1);
}

if (!packResult?.filename || !Array.isArray(packResult.files)) {
  console.error('npm pack returned an unexpected result.');
  process.exit(1);
}

const tarballPath = resolve(artifacts, packResult.filename);
const paths = packResult.files.map((file) => file.path.replaceAll('\\', '/'));
const required = [
  'package.json',
  'README.md',
  'LICENSE',
  'dist/index.js',
  'dist/index.d.ts',
  'dist/styles.css',
  'dist/components/button/index.js',
  'dist/components/button/index.d.ts',
  'dist/components/input/index.js',
  'dist/components/input/index.d.ts',
  'dist/components/textarea/index.js',
  'dist/components/textarea/index.d.ts',
  'dist/components/select/index.js',
  'dist/components/select/index.d.ts',
  'dist/components/checkbox/index.js',
  'dist/components/checkbox/index.d.ts',
  'dist/components/radio/index.js',
  'dist/components/radio/index.d.ts',
  'dist/components/switch/index.js',
  'dist/components/switch/index.d.ts',
  'dist/components/badge/index.js',
  'dist/components/badge/index.d.ts',
];
const forbiddenPatterns = [
  /^src\//,
  /^playground\//,
  /^examples\//,
  /^coverage\//,
  /^\.github\//,
  /^\.artifacts\//,
  /(?:^|\/)\.env(?:\.|$)/,
  /(?:^|\/)__tests__(?:\/|$)/,
  /\.test\.[cm]?[jt]sx?$/,
  /\.spec\.[cm]?[jt]sx?$/,
  /\.tgz$/,
];
const secretLikePattern = /(?:^|\/)(?:\.?npmrc|.*token.*|.*secret.*|.*credential.*|id_rsa)(?:$|\.)/i;
const maxFileSize = 2 * 1024 * 1024;
const errors = [];

for (const path of required) {
  if (!paths.includes(path)) {
    errors.push(`Missing required package file: ${path}`);
  }
}

for (const file of packResult.files) {
  const normalizedPath = file.path.replaceAll('\\', '/');
  if (forbiddenPatterns.some((pattern) => pattern.test(normalizedPath))) {
    errors.push(`Forbidden package file: ${normalizedPath}`);
  }
  if (secretLikePattern.test(normalizedPath)) {
    errors.push(`Secret-like filename: ${normalizedPath}`);
  }
  if (file.size > maxFileSize) {
    errors.push(`Excessively large file (${file.size} bytes): ${normalizedPath}`);
  }
}

const publicEntries = Object.keys(packageJson.exports ?? {});
console.log(`\nPackage: ${packResult.name ?? packageJson.name}`);
console.log(`Version: ${packResult.version ?? packageJson.version}`);
console.log(`Tarball: ${packResult.filename}`);
console.log(`Files: ${packResult.entryCount ?? packResult.files.length}`);
console.log(`Unpacked size: ${packResult.unpackedSize ?? 'unknown'} bytes`);
console.log(`Public entry points: ${publicEntries.join(', ')}`);
console.log('Main files:');
for (const path of required) {
  console.log(`  - ${path}`);
}

await rm(tarballPath, { force: true });

if (errors.length > 0) {
  console.error('\nPackage validation failed:');
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log('\nPackage contents are valid.');
