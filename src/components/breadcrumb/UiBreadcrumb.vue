<script setup lang="ts">
import { computed } from 'vue';
import type { UiBreadcrumbItem, UiBreadcrumbProps } from './UiBreadcrumb.types';

defineOptions({ name: 'UiBreadcrumb' });

const props = withDefaults(defineProps<UiBreadcrumbProps>(), { ariaLabel: 'Breadcrumb' });

const normalizedItems = computed<readonly UiBreadcrumbItem[]>(() => {
  if (Array.isArray(props.items)) return props.items;
  if ('label' in props.items && typeof props.items.label === 'string') return [props.items];
  return Object.values(props.items);
});
</script>

<template>
  <nav class="cui-breadcrumb" :aria-label="ariaLabel">
    <ol class="cui-breadcrumb__list">
      <li
        v-for="(item, index) in normalizedItems"
        :key="`${index}-${item.href ?? item.label}`"
        class="cui-breadcrumb__item"
      >
        <span class="cui-breadcrumb__entry">
          <slot
            name="item"
            :item="item"
            :index="index"
            :current="index === normalizedItems.length - 1"
          >
            <a
              v-if="item.href && !item.disabled && index !== normalizedItems.length - 1"
              class="cui-breadcrumb__crumb cui-breadcrumb__link"
              :href="item.href"
            >
              {{ item.label }}
            </a>
            <span
              v-else
              class="cui-breadcrumb__crumb"
              :data-current="index === normalizedItems.length - 1 || undefined"
              :data-disabled="item.disabled || undefined"
              :aria-current="index === normalizedItems.length - 1 ? 'page' : undefined"
              :aria-disabled="item.disabled ? 'true' : undefined"
            >
              {{ item.label }}
            </span>
          </slot>
        </span>
        <span
          v-if="index < normalizedItems.length - 1"
          class="cui-breadcrumb__separator"
          aria-hidden="true"
        >
          <slot name="separator">
            <svg viewBox="0 0 16 16" fill="none" focusable="false">
              <path d="m6 3.5 4.5 4.5L6 12.5" />
            </svg>
          </slot>
        </span>
      </li>
    </ol>
  </nav>
</template>