<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: { type: String, required: true },
  size: {
    type: String,
    default: 'small',
    validator(value) {
      return ['small', 'medium', 'large'].includes(value)
    },
  },
})

const classes = computed(() => `is-${props.size}`)
const iconName = computed(() => `fa-${props.icon}`)
</script>

<template lang="pug">
span.icon(:class="classes")
  i.fa(:class="iconName")
</template>
