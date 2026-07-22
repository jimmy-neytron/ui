import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import DemoFrame from './DemoFrame.vue';
import ComponentGallery from './ComponentGallery.vue';
import '@compact-ui/styles/index.css';
import './style.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoFrame', DemoFrame);
    app.component('ComponentGallery', ComponentGallery);
  },
} satisfies Theme;
