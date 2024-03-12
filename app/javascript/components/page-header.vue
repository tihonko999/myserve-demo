<script setup>
import { watchEffect } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
})

/**
 * @param {string} title
 */
const setDocumentTitle = (title) => {
  const titleParts = [title]
  const customerName = document.body.dataset.customerName
  if (customerName) titleParts.push(customerName)
  titleParts.push('My-Serve')
  document.title = titleParts.join(' - ')
}

watchEffect(() => setDocumentTitle(props.title))
</script>

<template lang="pug">
.page-heading.primary-branded-background
  .page-heading-inner.content-container
    h1.is-size-2(v-if="props.title") {{ props.title }}
    slot
</template>
