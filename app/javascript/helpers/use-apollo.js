import { ref, onBeforeUnmount, isRef, watch, computed } from 'vue'
import { debounce } from 'lodash-es'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

const tokenElement = document.querySelector('meta[name="access-token"]')
const token = tokenElement.attributes.content.value
const httpLink = createHttpLink({ uri: `${window.location.origin}/api/v2/graphql` })
const authLink = setContext(async (_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  }
})

const apolloClient = new ApolloClient({
  fetchOptions: { fetch },
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  // ability to cancel previous request https://github.com/apollographql/apollo-client/issues/4150#issuecomment-500127694
  queryDeduplication: false,
})

/**
 * @typedef {{[key: string]: string | number | (string | number)[]}} VariablesType
 */
export const useMutation = (mutation) => {
  const loading = ref(false)

  /**
   * @param {VariablesType} variables
   */
  const mutate = async (variables) => {
    if (loading.value) return
    loading.value = true
    try {
      const result = await apolloClient.mutate({ mutation, variables })
      // result example - {data: mdmConigCreate: {errors: [{text: 'can not find object'}]}}
      const key = Object.keys(result.data)?.[0]
      const errors = result.data?.[key]?.errors || result.errors || []
      if (errors.length) {
        throw new Error(errors.map((err) => err?.text || '').join(', '))
      }
      loading.value = false
      return result
    } catch (e) {
      loading.value = false
      throw new Error(e)
    }
  }

  return { mutate, loading }
}

/**
 * @param {unknown} query
 * @param {VariablesType | import('vue').Ref<VariablesType>} variables
 * @param {{enabled?: import('vue').Ref<boolean>; debounce?: number}} options?
 */
export const useQuery = (query, variables = null, options = {}) => {
  const enabled = options.enabled || computed(() => true)
  /**
   * using explicit type due to ref(null) type has no .value property
   * @type {{value: unknown}}
   */
  const result = ref(null)
  // if query is enabled, then loading is true, otherwise loading is false
  const loading = ref(enabled.value)
  /**
   * @type {{value: unknown}}
   */
  const error = ref(null)
  // ability cancel previous request https://github.com/apollographql/apollo-client/issues/4150#issuecomment-500127694
  const subscription = ref({ unsubscribe: () => null })
  const refVariables = isRef(variables) ? variables : ref(variables)
  onBeforeUnmount(() => subscription.value.unsubscribe())

  /**
   * @param {{refetch?: boolean; paginationVariables?: VariablesType; updateQuery?: (previousResult: unknown, newResult: {fetchMoreResult: unknown}}} options
   */
  function makeQuery(options = {}) {
    if (!enabled.value) {
      return
    }
    const isRefetchOrPagination = options.paginationVariables || options.refetch
    if (isRefetchOrPagination && loading.value) {
      return
    }
    loading.value = true
    error.value = false

    if (!isRefetchOrPagination) {
      result.value = null
    }

    const observable = apolloClient.watchQuery({
      query,
      variables: options.paginationVariables
        ? { ...refVariables.value, ...options.paginationVariables }
        : refVariables.value,
      fetchPolicy: options.refetch ? 'network-only' : 'cache-first',
    })
    subscription.value.unsubscribe()
    subscription.value = observable.subscribe({
      next: ({ data }) => {
        result.value = options.updateQuery
          ? options.updateQuery(result.value, { fetchMoreResult: data })
          : data
        loading.value = false
      },
      error: (e) => {
        console.error(e)
        result.value = null
        loading.value = false
        error.value = e
      },
    })
  }

  function refetch() {
    makeQuery({ refetch: true })
  }

  /**
   * @param {{variables: VariablesType; updateQuery: (previousResult: unknown, newResult: {fetchMoreResult: unknown}) => unknown}} options
   */
  function fetchMore(options = {}) {
    if (!options.variables || !options.updateQuery) {
      throw new Error('Provide variables and updateQuery options')
    }
    makeQuery({
      paginationVariables: options.variables,
      updateQuery: options.updateQuery,
    })
  }

  // watch vars and make first query
  watch(
    refVariables,
    debounce(() => makeQuery(), options.debounce || 0),
    { deep: true, immediate: true }
  )
  // watch enabled
  watch(enabled, () => {
    if (!enabled.value) {
      result.value = null
      loading.value = false
      return
    }
    makeQuery()
  })

  return { result, loading, error, refetch, fetchMore }
}
