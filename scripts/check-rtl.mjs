import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const css = await readFile(resolve(import.meta.dirname, '../src/styles/components.css'), 'utf8');
const physical = /(?:margin|padding|border|inset)-(?:left|right)\s*:|(?:^|[;{\s])(?:left|right)\s*:/gm;
const matches = [...css.matchAll(physical)];
if (matches.length) {
  console.error('Use CSS logical properties for RTL support:', matches.map((match) => match[0].trim()).join(', '));
  process.exit(1);
}
console.log('RTL check passed: component styles use logical properties.');