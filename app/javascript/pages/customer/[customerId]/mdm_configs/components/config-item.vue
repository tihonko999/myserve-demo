<script setup>
import { ref, computed } from 'vue'
import { defineMessages, useI18n } from '~/helpers/use-i18n'
import { formatDate } from '~/helpers/format-date'
import { useMutation } from '~/helpers/use-apollo'
import deleteConfigMutation from '../gql/delete-config-mutation.gql'
import { showError, showMessage } from '~/helpers/notifications'
import { BButton } from '~/components/ui'

const props = defineProps({
  config: { type: Object, required: true },
})

const messages = defineMessages({
  en: {
    delete: 'Delete',
    confirmDelete: 'Confirm integration deletion',
    successMessage: 'Integration was deleted successfully',
  },
  'fr-CA': {
    delete: 'Effacer',
    confirmDelete: "Confirmer la suppression de l'intégration",
    successMessage: "L'intégration a été supprimée avec succès",
  },
})
const { t } = useI18n({ messages })

const providers = {
  maas360: 'IBM MaaS360',
  airwatch: 'VMware AirWatch',
  ms_intune: 'Microsoft Intune',
  miradore: 'Miradore',
  g_suite: 'GSuite',
  soti: 'Soti MobiControl',
  zoho: 'Zoho',
}

const deleted = ref(false)
const lastEvent = computed(() => props.config.events.nodes[0])
const status = lastEvent.value?.details?.status

const { mutate, loading } = useMutation(deleteConfigMutation)
const deleteConfig = async () => {
  if (loading.value || !confirm(t('confirmDelete'))) return
  try {
    await mutate({ id: props.config.id })
    showMessage(t('successMessage'))
    deleted.value = true
  } catch (e) {
    showError(e)
  }
}
</script>

<template lang="pug">
tr(v-if="!deleted" data-test="mdm-config-items")
  td {{ props.config.id }}
  td
    span {{ providers[props.config.mdmName] }}
  td
    span(v-if="status")
      span(:class="status === 'failed' ? 'has-text-danger' : 'has-text-success'") {{ status }}
      .is-size-7.has-text-grey(v-if="lastEvent")
        span.mr-1 {{ formatDate(lastEvent.updatedAt, '%b %d, %Y %H:%M') }}.
        span {{ lastEvent.details.description }}
    span(v-else) -
  td
    .is-flex.is-justify-content-end
      b-button.is-danger(
        :loading="loading"
        :label="t('delete')"
        data-test="delete-integration-button"
        size="small"
        @click="deleteConfig"
      )
</template>
