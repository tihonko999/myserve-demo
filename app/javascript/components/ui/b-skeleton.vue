<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  count: { type: Number, default: 1 },
  type: {
    type: String,
    default: 'line',
    validator(value) {
      return ['line', 'list', 'table', 'card', 'form'].includes(value)
    },
  },
  size: {
    type: String,
    default: 'medium',
    validator(value) {
      return ['small', 'medium', 'large'].includes(value)
    },
  },
})

const getRandom = (min = 40, max = 100) => Math.floor(Math.random() * (max - min) + min)
const classes = computed(() => (props.size ? `is-${props.size}` : ''))
const styles = computed(() => ({
  width: props.width ? `${props.width}px` : null,
  height: props.height ? `${props.height}px` : null,
}))
</script>

<template lang="pug">
.skeleton(:class="classes")
  template(v-if="type === 'line'")
    .skeleton-item(v-for="index in count" :key="index" :style="styles")
  template(v-if="type === 'list'")
    .skeleton-item(
      v-for="index in count"
      :key="index"
      :style="{ width: `${index > 1 ? getRandom() : 100}%` }"
    )
  template(v-if="type === 'table'")
    table.table
      thead
        tr
          th(v-for="cell in 5" :key="cell")
            .skeleton-item(style="height: 20px")
      tbody
        tr(v-for="row in 7" :key="row")
          td(v-for="cell in 5" :key="cell")
            .skeleton-item(:style="{ width: `${getRandom()}%` }")
  template(v-if="type === 'card'")
    .card
      .card-header
        .skeleton-item(style="width: 33%; height: 20px")
      .card-content
        .skeleton-group(v-for="num in count" :key="num")
          .d-flex
            .skeleton-item(style="width: 25%")
            .skeleton-item(style="width: 25%")
          .skeleton-item(style="width: 33%")
          .skeleton-item(:style="{ width: `${count > 1 ? getRandom() : 80}%` }")
          .d-flex
            .skeleton-item(style="width: 20%")
            .skeleton-item(style="width: 20%")
            .skeleton-item(style="width: 20%")
            .skeleton-item(style="width: 20%")
            .skeleton-item(style="width: 20%")
          .skeleton-item(style="width: 100%")
</template>

<style lang="scss" scoped>
.skeleton {
  display: inline-flex;
  flex-direction: column;
  vertical-align: middle;
  width: 100%;

  --item-line-height: 1rem;
  &.is-small {
    --item-line-height: 0.75rem;
  }
  &.is-medium {
    line-height: 1.25rem;
  }
  &.is-large {
    line-height: 1.5rem;
  }
}
.skeleton-item {
  background: linear-gradient(90deg, #dbdbdb 25%, hsla(0, 0%, 86%, 0.5) 50%, #dbdbdb 75%);
  background-size: 400% 100%;
  width: 100%;
  border-radius: 4px;
  animation: skeleton-loading 1.5s infinite;
  line-height: var(--item-line-height);

  &:after {
    content: '\A0';
  }

  .card-header & {
    margin: 1.12rem 1rem;
  }

  & + & {
    margin-top: 0.5rem;
  }
}

.d-flex .skeleton-item {
  margin: 0.5rem 0.5rem 0.5rem 0;
}

.skeleton + .skeleton {
  margin-top: 0.5rem;
}

.skeleton .card {
  margin-bottom: 30px;
}

.skeleton-group:not(:last-of-type) {
  margin-bottom: 1.5rem;
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  to {
    background-position: 0 50%;
  }
}
</style>
