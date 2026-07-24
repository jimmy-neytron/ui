import { readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const expectedTag = `v${packageJson.version}`;
const releaseTag = process.env.RELEASE_TAG;

if (releaseTag !== expectedTag) {
  throw new Error(`Release tag ${releaseTag ?? '(missing)'} does not match ${expectedTag}`);
}

console.log(`Release tag ${releaseTag} matches package version`);
