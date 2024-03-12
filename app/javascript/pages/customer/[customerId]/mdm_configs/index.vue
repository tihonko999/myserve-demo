<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '~/components/page-header.vue'
import { BSkeleton, BTable } from '~/components/ui'
import EmptyBlock from '~/components/empty-block.vue'
import { defineMessages, useI18n } from '~/helpers/use-i18n'
import { useQuery } from '~/helpers/use-apollo'
import ConfigItem from './components/config-item.vue'
import configsQuery from './gql/configs-query.gql'

defineOptions({ name: 'MdmConfigs' })

const messages = defineMessages({
  en: {
    id: 'ID',
    title: 'MDM/UEM Integration',
    integration: 'Integration',
    status: 'Status',
    actions: 'Actions',
  },
  'fr-CA': {
    id: 'ID',
    title: 'MDM Integrations',
    integration: 'intégration',
    status: 'Statut',
    actions: 'Actions',
  },
})
const { t } = useI18n({ messages })
const route = useRoute()

const { result, loading } = useQuery(configsQuery, { customerId: route.params.customerId })
const configs = computed(() => result.value?.customer.mdmConfigs.nodes || [])
</script>

<template lang="pug">
div
  page-header(:title="t('title')")
  .card.mb-5
    .card-header
      .card-header-title {{ t('title') }}
    .card-content
      b-skeleton(v-if="loading" type="table")
      b-table(v-else-if="configs.length")
        thead
          tr
            th {{ t('id') }}
            th {{ t('integration') }}
            th {{ t('status') }}
            th {{ t('actions') }}
        tbody
          config-item(v-for="config in configs" :key="config.id" :config="config")
      empty-block(v-else)
</template>
