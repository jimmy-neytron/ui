<script setup lang="ts" generic="TValue extends UiSelectValue = UiSelectValue">
import { computed, getCurrentInstance, nextTick, ref, useAttrs, watch } from 'vue';
import { useClickOutside } from '../../composables/useClickOutside';
import { useStableId } from '../../composables/useStableId';
import IconCheck from '../../internal/icons/IconCheck.vue';
import IconChevronDown from '../../internal/icons/IconChevronDown.vue';
import IconClose from '../../internal/icons/IconClose.vue';
import type {
  UiSelectModelValue,
  UiSelectOption,
  UiSelectProps,
  UiSelectValue,
} from './UiSelect.types';

defineOptions({
  name: 'UiSelect',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<UiSelectProps<TValue>>(), {
  multiple: false,
  searchable: false,
  clearable: false,
  disabled: false,
  loading: false,
  placeholder: 'Select an option',
  searchPlaceholder: 'Search options',
  noOptionsText: 'No options',
  noResultsText: 'No results',
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: UiSelectModelValue<TValue>];
  open: [];
  close: [];
  search: [query: string];
  clear: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();
const rootRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const searchQuery = ref('');
const activeIndex = ref(-1);

const selectId = useStableId('select', () =>
  typeof attrs.id === 'string' ? attrs.id : undefined,
);
const listboxId = computed(() => `${selectId.value}-listbox`);
const labelId = computed(() => `${selectId.value}-label`);
const hintId = computed(() => `${selectId.value}-hint`);
const errorId = computed(() => `${selectId.value}-error`);

const selectedValues = computed<readonly TValue[]>(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : [];
  }

  return Array.isArray(props.modelValue)
    || props.modelValue === null
    || props.modelValue === undefined
    ? []
    : [props.modelValue];
});

const selectedOptions = computed(() =>
  props.options.filter((option) => selectedValues.value.includes(option.value)),
);

const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase());
const filteredOptions = computed(() => {
  if (!props.searchable || normalizedQuery.value === '') {
    return props.options;
  }

  return props.options.filter((option) =>
    option.label.toLowerCase().includes(normalizedQuery.value),
  );
});

const shouldCloseOnSelect = computed(() => {
  const vnodeProps = instance?.vnode.props;
  const isExplicitlyProvided = Boolean(
    vnodeProps
      && (
        Object.prototype.hasOwnProperty.call(vnodeProps, 'closeOnSelect')
        || Object.prototype.hasOwnProperty.call(vnodeProps, 'close-on-select')
      ),
  );

  return isExplicitlyProvided ? props.closeOnSelect === true : !props.multiple;
});
const activeOption = computed(() => filteredOptions.value[activeIndex.value]);
const activeDescendant = computed(() =>
  isOpen.value && activeIndex.value >= 0
    ? `${listboxId.value}-option-${activeIndex.value}`
    : undefined,
);
const hasSelection = computed(() => selectedValues.value.length > 0);
const describedBy = computed(() => {
  const ids = [
    typeof attrs['aria-describedby'] === 'string' ? attrs['aria-describedby'] : undefined,
    props.hint && !props.error ? hintId.value : undefined,
    props.error ? errorId.value : undefined,
  ].filter((value): value is string => Boolean(value));

  return ids.length > 0 ? ids.join(' ') : undefined;
});
const menuStyle = computed(() => {
  if (props.maxMenuHeight === undefined) {
    return undefined;
  }

  return {
    maxBlockSize:
      typeof props.maxMenuHeight === 'number'
        ? `${props.maxMenuHeight}px`
        : props.maxMenuHeight,
  };
});

function isSelected(value: TValue) {
  return selectedValues.value.includes(value);
}

function firstEnabledIndex() {
  return filteredOptions.value.findIndex((option) => !option.disabled);
}

function lastEnabledIndex() {
  for (let index = filteredOptions.value.length - 1; index >= 0; index -= 1) {
    if (!filteredOptions.value[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function findNextEnabledIndex(start: number, direction: 1 | -1) {
  const length = filteredOptions.value.length;
  if (length === 0) {
    return -1;
  }

  for (let offset = 1; offset <= length; offset += 1) {
    const index = (start + direction * offset + length) % length;
    if (!filteredOptions.value[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function setInitialActiveIndex() {
  const selectedIndex = filteredOptions.value.findIndex(
    (option) => isSelected(option.value) && !option.disabled,
  );
  activeIndex.value = selectedIndex >= 0 ? selectedIndex : firstEnabledIndex();
}

async function openMenu() {
  if (props.disabled || isOpen.value) {
    return;
  }

  isOpen.value = true;
  searchQuery.value = '';
  setInitialActiveIndex();
  emit('open');

  if (props.searchable) {
    await nextTick();
    searchInputRef.value?.focus();
  }
}

function closeMenu(restoreFocus = true) {
  if (!isOpen.value) {
    return;
  }

  isOpen.value = false;
  if (searchQuery.value !== '') {
    searchQuery.value = '';
    emit('search', '');
  }
  activeIndex.value = -1;
  emit('close');

  if (restoreFocus) {
    void nextTick(() => {
      triggerRef.value?.focus();
    });
  }
}

function toggleMenu() {
  if (isOpen.value) {
    void closeMenu();
  } else {
    void openMenu();
  }
}

function selectOption(option: UiSelectOption<TValue>) {
  if (option.disabled || props.disabled || props.loading) {
    return;
  }

  if (props.multiple) {
    const current = [...selectedValues.value];
    const nextValue = current.includes(option.value)
      ? current.filter((value) => value !== option.value)
      : [...current, option.value];
    emit('update:modelValue', nextValue);
  } else {
    emit('update:modelValue', option.value);
  }

  if (shouldCloseOnSelect.value) {
    void closeMenu();
  }
}

function removeValue(value: TValue) {
  if (props.disabled || props.loading) {
    return;
  }

  const nextValue = selectedValues.value.filter((selectedValue) => selectedValue !== value);
  emit('update:modelValue', nextValue);
}

function clearSelection() {
  if (props.disabled || props.loading) {
    return;
  }

  emit('update:modelValue', props.multiple ? [] : null);
  emit('clear');
  triggerRef.value?.focus();
}

function moveActive(direction: 1 | -1) {
  if (!isOpen.value) {
    void openMenu();
    return;
  }

  const start = activeIndex.value >= 0
    ? activeIndex.value
    : direction === 1
      ? -1
      : 0;
  activeIndex.value = findNextEnabledIndex(start, direction);
}

function chooseActiveOption() {
  if (activeOption.value) {
    selectOption(activeOption.value);
  }
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (event.target !== triggerRef.value) {
    return;
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      moveActive(1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      moveActive(-1);
      break;
    case 'Home':
      if (isOpen.value) {
        event.preventDefault();
        activeIndex.value = firstEnabledIndex();
      }
      break;
    case 'End':
      if (isOpen.value) {
        event.preventDefault();
        activeIndex.value = lastEnabledIndex();
      }
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      if (!isOpen.value) {
        void openMenu();
      } else {
        chooseActiveOption();
      }
      break;
    case 'Escape':
      if (isOpen.value) {
        event.preventDefault();
        void closeMenu();
      }
      break;
    case 'Tab':
      if (isOpen.value) {
        void closeMenu(false);
      }
      break;
  }
}

function handleSearchKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      moveActive(1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      moveActive(-1);
      break;
    case 'Home':
      event.preventDefault();
      activeIndex.value = firstEnabledIndex();
      break;
    case 'End':
      event.preventDefault();
      activeIndex.value = lastEnabledIndex();
      break;
    case 'Enter':
      event.preventDefault();
      chooseActiveOption();
      break;
    case 'Escape':
      event.preventDefault();
      void closeMenu();
      break;
    case 'Tab':
      void closeMenu(false);
      break;
  }
}

function handleFocusIn(event: FocusEvent) {
  const relatedTarget = event.relatedTarget;
  if (!(relatedTarget instanceof Node) || !rootRef.value?.contains(relatedTarget)) {
    emit('focus', event);
  }
}

function handleFocusOut(event: FocusEvent) {
  const relatedTarget = event.relatedTarget;
  if (!(relatedTarget instanceof Node) || !rootRef.value?.contains(relatedTarget)) {
    emit('blur', event);
  }
}

function handleSearchInput(event: Event) {
  const target = event.target;
  if (target instanceof HTMLInputElement) {
    searchQuery.value = target.value;
    activeIndex.value = -1;
    emit('search', target.value);
  }
}

useClickOutside(rootRef, () => {
  void closeMenu(false);
});

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      void closeMenu(false);
    }
  },
);

watch(filteredOptions, () => {
  if (!isOpen.value) {
    return;
  }

  if (activeIndex.value >= filteredOptions.value.length || activeIndex.value < 0) {
    activeIndex.value = firstEnabledIndex();
  }
});
</script>

<template>
  <div
    ref="rootRef"
    class="cui-field cui-select"
    :data-size="size"
    :data-open="isOpen || undefined"
    :data-disabled="disabled || undefined"
    :data-invalid="Boolean(error) || undefined"
    :data-loading="loading || undefined"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <label v-if="label" :id="labelId" class="cui-field__label" @click="triggerRef?.focus()">
      {{ label }}
    </label>

    <div class="cui-select__anchor">
      <div
        v-bind="attrs"
        :id="selectId"
        ref="triggerRef"
        class="cui-select__control"
        role="combobox"
        :tabindex="disabled ? -1 : 0"
        aria-haspopup="listbox"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="listboxId"
        :aria-activedescendant="activeDescendant"
        :aria-labelledby="label ? labelId : undefined"
        :aria-label="!label ? (typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : placeholder) : undefined"
        :aria-describedby="describedBy"
        :aria-invalid="error ? 'true' : undefined"
        :aria-disabled="disabled ? 'true' : undefined"
        :aria-busy="loading ? 'true' : undefined"
        @click="toggleMenu"
        @keydown="handleTriggerKeydown"
      >
        <span v-if="$slots.prefix" class="cui-select__affix" aria-hidden="true">
          <slot name="prefix" />
        </span>

        <div class="cui-select__value">
          <slot
            v-if="$slots.selected && hasSelection"
            name="selected"
            :options="selectedOptions"
            :values="selectedValues"
          />

          <template v-else-if="multiple && selectedOptions.length > 0">
            <span
              v-for="option in selectedOptions"
              :key="option.value"
              class="cui-select__chip"
            >
              <span>{{ option.label }}</span>
              <button
                type="button"
                class="cui-select__chip-remove"
                :aria-label="`Remove ${option.label}`"
                :disabled="disabled || loading"
                @click.stop="removeValue(option.value)"
              >
                <IconClose />
              </button>
            </span>
          </template>

          <span v-else-if="selectedOptions[0]" class="cui-select__single-value">
            {{ selectedOptions[0].label }}
          </span>

          <span v-else class="cui-select__placeholder">{{ placeholder }}</span>
        </div>

        <button
          v-if="clearable && hasSelection"
          type="button"
          class="cui-select__clear"
          aria-label="Clear selection"
          :disabled="disabled || loading"
          @click.stop="clearSelection"
        >
          <IconClose />
        </button>

        <span v-if="loading" class="cui-select__loader" aria-hidden="true">
          <span class="cui-spinner" />
        </span>
        <span v-else-if="$slots.suffix" class="cui-select__affix" aria-hidden="true">
          <slot name="suffix" />
        </span>
        <span v-else class="cui-select__chevron" aria-hidden="true">
          <IconChevronDown />
        </span>
      </div>

      <div v-if="isOpen" class="cui-select__menu" :style="menuStyle">
        <div v-if="searchable" class="cui-select__search-wrap">
          <input
            ref="searchInputRef"
            class="cui-select__search"
            type="search"
            :value="searchQuery"
            :placeholder="searchPlaceholder"
            aria-label="Search options"
            :aria-controls="listboxId"
            :aria-activedescendant="activeDescendant"
            @input="handleSearchInput"
            @keydown="handleSearchKeydown"
          />
        </div>

        <div
          :id="listboxId"
          class="cui-select__listbox"
          role="listbox"
          :aria-multiselectable="multiple ? 'true' : undefined"
        >
          <div v-if="loading" class="cui-select__state" role="status">
            <slot name="loading">Loading…</slot>
          </div>

          <template v-else-if="filteredOptions.length > 0">
            <div
              v-for="(option, index) in filteredOptions"
              :id="`${listboxId}-option-${index}`"
              :key="option.value"
              class="cui-select__option"
              role="option"
              :aria-selected="isSelected(option.value) ? 'true' : 'false'"
              :aria-disabled="option.disabled ? 'true' : undefined"
              :data-active="activeIndex === index || undefined"
              :data-selected="isSelected(option.value) || undefined"
              :data-disabled="option.disabled || undefined"
              @mouseenter="!option.disabled && (activeIndex = index)"
              @mousedown.prevent
              @click="selectOption(option)"
            >
              <slot name="option" :option="option" :selected="isSelected(option.value)">
                <span>{{ option.label }}</span>
              </slot>
              <span
                v-if="isSelected(option.value)"
                class="cui-select__check"
                aria-hidden="true"
              >
                <IconCheck />
              </span>
            </div>
          </template>

          <div v-else class="cui-select__state">
            <slot name="empty" :search-query="searchQuery">
              {{ options.length === 0 ? noOptionsText : noResultsText }}
            </slot>
          </div>
        </div>
      </div>
    </div>

    <template v-if="name">
      <input
        v-for="value in selectedValues"
        :key="value"
        type="hidden"
        :name="name"
        :value="String(value)"
      />
    </template>

    <p v-if="error" :id="errorId" class="cui-field__message cui-field__message--error">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" class="cui-field__message">
      {{ hint }}
    </p>
  </div>
</template>
