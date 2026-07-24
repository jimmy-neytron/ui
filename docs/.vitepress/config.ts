import { resolve } from 'node:path';
import { defineConfig } from 'vitepress';
import { injectDemoFrameSource } from './markdown/injectDemoFrameSource';
const repositoryUrl = 'https://github.com/jimmy-neytron/ui';
const description = 'Документация Vue 3 UI-библиотеки Compact UI';
const siteUrl = (process.env.URL ?? '').replace(/\/$/, '');
const socialImageUrl = `${siteUrl}/og.png`;
export default defineConfig({
  lang: 'ru-RU', title: 'Compact UI',
  description,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#111827' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'ru_RU' }],
    ['meta', { property: 'og:site_name', content: 'Compact UI' }],
    ['meta', { property: 'og:title', content: 'Compact UI — UI-компоненты для Vue 3' }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: siteUrl || '/' }],
    ['meta', { property: 'og:image', content: socialImageUrl }],
    ['meta', { property: 'og:image:type', content: 'image/png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'Compact UI — UI-компоненты для Vue 3' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Compact UI — UI-компоненты для Vue 3' }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: socialImageUrl }],
  ],
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
      { text: 'v0.3.2', link: `${repositoryUrl}/releases` },
    ],
    sidebar: [
      { text: 'Начало работы', items: [
        { text: 'Обзор', link: '/guide/overview' },
        { text: 'Установка', link: '/guide/getting-started' },
        { text: 'Темы и токены', link: '/guide/theming' },
        { text: 'Доступность', link: '/guide/accessibility' },
        { text: 'Локализация', link: '/guide/localization' },
        { text: 'Песочница', link: '/guide/playground' },
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
        { text: 'Accordion', link: '/components/accordion' },
        { text: 'Avatar', link: '/components/avatar' },
        { text: 'Breadcrumb', link: '/components/breadcrumb' },
        { text: 'Dialog', link: '/components/dialog' },
        { text: 'Divider', link: '/components/divider' },
        { text: 'DropdownMenu', link: '/components/dropdown-menu' },
        { text: 'EmptyState', link: '/components/empty-state' },
        { text: 'Pagination', link: '/components/pagination' },
        { text: 'Popover', link: '/components/popover' },
        { text: 'Skeleton', link: '/components/skeleton' },
        { text: 'Tabs', link: '/components/tabs' },
        { text: 'Toast', link: '/components/toast' },
        { text: 'Tooltip', link: '/components/tooltip' },
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
