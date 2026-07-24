import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, relative, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

const budgets = {
  fullJs: 44 * 1024,
  css: 16 * 1024,
  button: 3 * 1024,
  input: 3 * 1024,
  textarea: 3 * 1024,
  select: 12 * 1024,
  checkbox: 3 * 1024,
  radio: 3 * 1024,
  switch: 3 * 1024,
  badge: 3 * 1024,
  alert: 3 * 1024,
  card: 3 * 1024,
  progress: 3 * 1024,
  spinner: 3 * 1024,
  dataTable: 18 * 1024,
};

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(path));
    } else {
      files.push(path);
    }
  }

  return files;
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

async function measure(path) {
  const content = await readFile(path);
  return {
    raw: content.byteLength,
    gzip: gzipSync(content, { level: 9 }).byteLength,
  };
}

async function collectEntryGraph(entryPath, allJsFiles) {
  const visited = new Set();

  async function visit(path) {
    if (visited.has(path)) {
      return;
    }
    visited.add(path);

    const source = await readFile(path, 'utf8');
    const importPattern = /(?:from\s*|import\s*)["']([^"']+\.js)["']/g;
    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1];
      if (!specifier?.startsWith('.')) {
        continue;
      }
      const importedPath = resolve(dirname(path), specifier);
      if (allJsFiles.has(importedPath)) {
        await visit(importedPath);
      }
    }
  }

  await visit(entryPath);
  return [...visited];
}

async function measureFiles(paths) {
  let raw = 0;
  let gzip = 0;
  for (const path of paths) {
    const size = await measure(path);
    raw += size.raw;
    gzip += size.gzip;
  }
  return { raw, gzip };
}

let files;
try {
  files = await walk(dist);
} catch {
  console.error('dist/ is missing. Run npm run build first.');
  process.exit(1);
}

const jsFiles = files.filter((path) => extname(path) === '.js');
const cssFiles = files.filter((path) => extname(path) === '.css');
const jsSet = new Set(jsFiles);
const results = [];

const fullJs = await measureFiles(jsFiles);
results.push({ name: 'Full JS', ...fullJs, budget: budgets.fullJs });

const css = await measureFiles(cssFiles);
results.push({ name: 'CSS', ...css, budget: budgets.css });

const componentEntries = [
  'button', 'input', 'textarea', 'select', 'checkbox', 'radio', 'switch', 'badge',
  'alert', 'card', 'progress', 'spinner', 'accordion', 'avatar', 'breadcrumb',
  'config-provider', 'dialog', 'divider', 'dropdown-menu', 'empty-state', 'pagination',
  'data-table', 'popover', 'skeleton', 'tabs', 'toast', 'tooltip',
];

for (const name of componentEntries) {
  const budgetKey = name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  const budget = budgets[budgetKey] ?? 5 * 1024;
  const entryPath = resolve(dist, `components/${name}/index.js`);
  try {
    await stat(entryPath);
  } catch {
    console.error(`Missing public entry: ${relative(root, entryPath)}`);
    process.exit(1);
  }
  const graph = await collectEntryGraph(entryPath, jsSet);
  const size = await measureFiles(graph);
  results.push({ name: name[0].toUpperCase() + name.slice(1), ...size, budget });
}

console.log('\nBundle size report (Vue is external):');
console.log('Asset'.padEnd(14), 'Raw'.padStart(11), 'Gzip'.padStart(11), 'Budget'.padStart(11), 'Status'.padStart(8));

let failed = false;
for (const result of results) {
  const withinBudget = result.gzip <= result.budget;
  failed ||= !withinBudget;
  console.log(
    result.name.padEnd(14),
    formatBytes(result.raw).padStart(11),
    formatBytes(result.gzip).padStart(11),
    formatBytes(result.budget).padStart(11),
    (withinBudget ? 'OK' : 'OVER').padStart(8),
  );
}

if (failed) {
  console.error('\nOne or more bundle budgets were exceeded.');
  process.exit(1);
}
