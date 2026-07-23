<script setup>
import { UiBadge } from '@compact-ui';
</script>

# Badge

Компактный статус или метка. Badge не является интерактивной кнопкой.

## Tones

<DemoFrame title="tone">
  <div class="demo-row demo-row--center">
    <UiBadge tone="neutral">Neutral</UiBadge>
    <UiBadge tone="primary">Primary</UiBadge>
    <UiBadge tone="success">Success</UiBadge>
    <UiBadge tone="warning">Warning</UiBadge>
    <UiBadge tone="danger">Danger</UiBadge>
  </div>
</DemoFrame>

## Variants

<DemoFrame title="variant">
  <div class="demo-row demo-row--center">
    <UiBadge tone="primary" variant="soft">Soft</UiBadge>
    <UiBadge tone="primary" variant="solid">Solid</UiBadge>
    <UiBadge tone="primary" variant="outline">Outline</UiBadge>
  </div>
</DemoFrame>

## Размеры

<DemoFrame title="size">
  <div class="demo-row demo-row--center">
    <UiBadge size="sm">Small</UiBadge>
    <UiBadge size="md">Medium</UiBadge>
    <UiBadge size="lg">Large</UiBadge>
  </div>
</DemoFrame>

## Dot, leading slot и native attrs

<DemoFrame title="dot, leading, title">
  <div class="demo-row demo-row--center">
    <UiBadge tone="success" dot>Online</UiBadge>
    <UiBadge tone="primary">
      <template #leading>✓</template>
      Verified
    </UiBadge>
    <UiBadge tone="warning" title="Требуется проверка">Hover for title</UiBadge>
  </div>
</DemoFrame>

## Props

| Prop | Тип | Default |
|---|---|---|
| `tone` | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` |
| `variant` | `'soft' \| 'solid' \| 'outline'` | `'soft'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `dot` | `boolean` | `false` |

Слоты: `default`, `leading`. Native attrs передаются корневому span.
