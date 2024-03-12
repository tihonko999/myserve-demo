<script setup>
import { computed } from 'vue'
import BIcon from './b-icon.vue'

const props = defineProps({
  iconLeft: { type: String, default: '' },
  iconRight: { type: String, default: '' },
  label: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  dataTest: { type: String, default: null },
  expanded: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'medium',
    validator(value) {
      return ['small', 'medium', 'large'].includes(value)
    },
  },
  type: {
    type: String,
    default: 'button',
    validator(value) {
      return ['button', 'submit', 'reset'].includes(value)
    },
  },
  badge: { type: String, default: '' },
  role: { type: String, default: 'button' },
})

const emit = defineEmits(['click'])

const classes = computed(() => ({
  'is-fullwidth': props.expanded,
  'is-loading': props.loading,
  [`is-${props.size}`]: !!props.size,
}))

const iconSize = computed(() => (props.size === 'is-large' ? 'medium' : 'small'))
</script>

<template lang="pug">
button.button(
  :disabled="props.disabled"
  :class="classes"
  :type="type"
  :role="role"
  :data-test="props.dataTest"
  @click="(event) => emit('click', event)"
)
  b-icon(v-if="iconLeft" :icon="iconLeft" :size="iconSize")
  span.button-label(v-if="label") {{ label }}
  span.button-badge.tag.is-white(v-if="badge") {{ badge }}
  b-icon(v-if="iconRight" :icon="iconRight" :size="iconSize")
</template>
