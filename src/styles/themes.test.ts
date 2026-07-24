import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const themesCss = readFileSync(resolve(process.cwd(), 'src/styles/themes.css'), 'utf8');

describe('theme defaults', () => {
  it('uses the light theme at the root by default', () => {
    expect(themesCss).toMatch(/^:root,\s*\n\[data-cui-theme='light'\]/);
  });

  it('resolves control tokens on every explicit theme container', () => {
    const controlTokens = themesCss.slice(
      themesCss.indexOf('/* Theme-dependent component tokens'),
      themesCss.indexOf("[data-cui-theme='dark'] {"),
    );

    expect(controlTokens).toContain("[data-cui-theme='light']");
    expect(controlTokens).toContain("[data-cui-theme='dark']");
    expect(controlTokens).toContain("[data-cui-theme='system']");
    expect(controlTokens).toContain('--cui-input-background: var(--cui-color-surface)');
    expect(controlTokens).toContain('--cui-select-menu-background: var(--cui-color-surface)');
  });

  it('applies the system dark theme only when explicitly requested', () => {
    const darkMediaQuery = themesCss.slice(themesCss.indexOf('@media (prefers-color-scheme: dark)'));

    expect(darkMediaQuery).toContain("[data-cui-theme='system']");
    expect(darkMediaQuery).not.toContain(':root');
  });
});
