import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const themesCss = readFileSync(resolve(process.cwd(), 'src/styles/themes.css'), 'utf8');

describe('theme defaults', () => {
  it('uses the light theme at the root by default', () => {
    expect(themesCss).toMatch(/^:root,\s*\n\[data-cui-theme='light'\]/);
  });

  it('applies the system dark theme only when explicitly requested', () => {
    const darkMediaQuery = themesCss.slice(themesCss.indexOf('@media (prefers-color-scheme: dark)'));

    expect(darkMediaQuery).toContain("[data-cui-theme='system']");
    expect(darkMediaQuery).not.toContain(':root');
  });
});
