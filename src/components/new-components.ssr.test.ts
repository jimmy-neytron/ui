// @vitest-environment node
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import UiDialog from './dialog/UiDialog.vue';
import UiSkeleton from './skeleton/UiSkeleton.vue';
import UiTabs from './tabs/UiTabs.vue';

describe('SSR compatibility', () => {
  it('renders browser-sensitive components without document', async () => {
    const App = { render: () => h('main', [h(UiDialog, { modelValue: true, teleport: false, title: 'SSR' }), h(UiSkeleton), h(UiTabs, { modelValue: 'a', items: [{ value: 'a', label: 'A' }] })]) };
    const html = await renderToString(createSSRApp(App));
    expect(html).toContain('SSR');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('cui-skeleton');
  });
});