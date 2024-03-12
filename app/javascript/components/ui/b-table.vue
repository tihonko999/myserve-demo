<script setup>
const props = defineProps({
  striped: { type: Boolean, default: false },
})
</script>

<template lang="pug">
.table-container
  table.table(:class="{ 'is-striped': props.striped }")
    slot
</template>
