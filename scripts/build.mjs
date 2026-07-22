import { access, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { runNpm } from './npm-process.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

function runScript(script) {
  const result = runNpm(['run', script], {
    cwd: root,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

await rm(dist, { recursive: true, force: true });
runScript('build:js');
runScript('build:types');
await rm(resolve(dist, 'styles.js'), { force: true });
await rm(resolve(dist, 'styles.js.map'), { force: true });

try {
  await access(resolve(dist, 'index.js'));
  await access(resolve(dist, 'index.d.ts'));
  await access(resolve(dist, 'styles.css'));
} catch {
  console.error('Build completed without all required public files.');
  process.exit(1);
}

console.log('Package build completed successfully.');
