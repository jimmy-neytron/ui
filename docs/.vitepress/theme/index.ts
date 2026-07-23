import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import DemoFrame from './DemoFrame.vue';
import ComponentGallery from './ComponentGallery.vue';
import CustomizationDemo from './CustomizationDemo.vue';
import ApiTable from './ApiTable.vue';
import ToastPlayground from './ToastPlayground.vue';
import '@compact-ui/styles/index.css';
import './style.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoFrame', DemoFrame);
    app.component('ComponentGallery', ComponentGallery);
    app.component('CustomizationDemo', CustomizationDemo);
    app.component('ApiTable', ApiTable);
    app.component('ToastPlayground', ToastPlayground);
  },
} satisfies Theme;
