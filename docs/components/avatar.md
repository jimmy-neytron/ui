<script setup>
import { UiAvatar } from '@compact-ui';
</script>
# Avatar
Аватар с изображением, инициалами, статусом и fallback-слотами.
## Все варианты
<DemoFrame title="src, alt, name, size, shape, status">
  <div class="demo-inline">
    <UiAvatar src="https://i.pravatar.cc/96?img=12" alt="Профиль Анны" name="Анна Смирнова" size="sm" status="online" />
    <UiAvatar name="Ada Lovelace" size="md" shape="rounded" status="away" />
    <UiAvatar name="Grace Hopper" size="lg" shape="square" status="busy" />
    <UiAvatar name="Offline" status="offline"><template #status>!</template></UiAvatar>
    <UiAvatar><template #default>UI</template></UiAvatar>
  </div>
</DemoFrame>
## Props
<ApiTable component="UiAvatarProps" />
Слоты: `default` — fallback, `status` — содержимое индикатора.