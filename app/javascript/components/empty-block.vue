<script setup>
import { defineMessages, useI18n } from '~/helpers/use-i18n'
import BIcon from '~/components/ui/b-icon.vue'

const props = defineProps({
  text: { type: String, default: '' },
  size: {
    type: String,
    default: 'large',
    validator(value) {
      return ['small', 'medium', 'large'].includes(value)
    },
  },
})
const messages = defineMessages({
  en: { label: 'Nothing here' },
  'fr-CA': { label: 'Rien ici' },
})
const { t } = useI18n({ messages })
</script>

<template lang="pug">
.content.has-text-centered
  p.has-text-grey-light
    b-icon(icon="inbox" :size="size")
  p.has-text-grey
    slot {{ props.text || t('label') }}
</template>
