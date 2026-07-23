import { mkdir, readdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { runNpm } from './npm-process.mjs';

const root = resolve(import.meta.dirname, '..');
const artifacts = resolve(root, '.artifacts');
const consumer = resolve(root, 'examples/consumer');
const keepTarball = process.argv.includes('--keep');

function run(args, cwd = root, capture = false) {
  const result = runNpm(args, {
    cwd,
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    encoding: capture ? 'utf8' : undefined,
  });

  if (result.status !== 0) {
    if (capture) {
      process.stdout.write(result.stdout ?? '');
      process.stderr.write(result.stderr ?? '');
    }
    process.exit(result.status ?? 1);
  }

  return result;
}

await mkdir(artifacts, { recursive: true });
for (const file of await readdir(artifacts)) {
  if (file.endsWith('.tgz')) {
    await rm(resolve(artifacts, file), { force: true });
  }
}

run(['run', 'build']);
const pack = run(['pack', '--json', '--pack-destination', artifacts], root, true);
const packData = JSON.parse((pack.stdout ?? '').trim())[0];
if (!packData?.filename) {
  console.error('npm pack did not return a tarball filename.');
  process.exit(1);
}
const tarballPath = resolve(artifacts, packData.filename);

try {
  run(['ci', '--ignore-scripts'], consumer);
  run([
    'install',
    '--no-save',
    '--package-lock=false',
    '--ignore-scripts',
    '--offline',
    tarballPath,
  ], consumer);
  run(['run', 'typecheck'], consumer);
  run(['run', 'build'], consumer);
  console.log(`\nConsumer successfully tested ${packData.filename}.`);
} finally {
  if (!keepTarball) {
    await rm(tarballPath, { force: true });
  } else {
    console.log(`Tarball kept at ${tarballPath}`);
  }
}
