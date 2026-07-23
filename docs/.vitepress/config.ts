import { resolve } from 'node:path';
import { defineConfig } from 'vitepress';
import { injectDemoFrameSource } from './markdown/injectDemoFrameSource';
const repositoryUrl = 'https://github.com/jimmy-neytron/ui';
export default defineConfig({
  lang: 'ru-RU', title: 'Compact UI',
  description: 'Документация Vue 3 UI-библиотеки Compact UI',
  cleanUrls: true, lastUpdated: true,
  srcExclude: ['ARCHITECTURE.md', 'GIT_NPM_RELEASE_GUIDE.md'],
  markdown: {
    config(markdown) {
      markdown.core.ruler.before('block', 'demo-frame-source', (state) => {
        state.src = injectDemoFrameSource(state.src);
      });
    },
  },
  vite: {
    resolve: {
      alias: { '@compact-ui': resolve(import.meta.dirname, '../../src') },
      dedupe: ['vue'],
    },
  },
  themeConfig: {
    siteTitle: 'Compact UI', search: { provider: 'local' },
    nav: [
      { text: 'Руководство', link: '/guide/getting-started' },
      { text: 'Компоненты', link: '/components/button' },
      { text: 'Темы', link: '/guide/theming' },
      { text: 'v0.2.1', link: `${repositoryUrl}/releases` },
    ],
    sidebar: [
      { text: 'Начало работы', items: [
        { text: 'Обзор', link: '/guide/overview' },
        { text: 'Установка', link: '/guide/getting-started' },
        { text: 'Темы и токены', link: '/guide/theming' },
        { text: 'Доступность', link: '/guide/accessibility' },
      ] },
      { text: 'Компоненты', items: [
        { text: 'Button', link: '/components/button' },
        { text: 'Input', link: '/components/input' },
        { text: 'Textarea', link: '/components/textarea' },
        { text: 'Select', link: '/components/select' },
        { text: 'Checkbox', link: '/components/checkbox' },
        { text: 'Radio', link: '/components/radio' },
        { text: 'Switch', link: '/components/switch' },
        { text: 'Badge', link: '/components/badge' },
        { text: 'Alert', link: '/components/alert' },
        { text: 'Card', link: '/components/card' },
        { text: 'Progress', link: '/components/progress' },
        { text: 'Spinner', link: '/components/spinner' },
      ] },
    ],
    socialLinks: [{ icon: 'github', link: repositoryUrl }],
    editLink: { pattern: `${repositoryUrl}/edit/main/docs/:path`, text: 'Редактировать страницу' },
    lastUpdated: { text: 'Обновлено' },
    docFooter: { prev: 'Назад', next: 'Далее' },
    outline: { label: 'На странице', level: [2, 3] },
    returnToTopLabel: 'Наверх', sidebarMenuLabel: 'Меню',
  },
});
