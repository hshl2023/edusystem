import { reactive } from 'vue'

interface QueryCache {
  [key: string]: {
    data: any
    timestamp: number
    isStale: boolean
  }
}

const queryCache = reactive<QueryCache>({})
const staleTime = 5 * 60 * 1000

export function useQueryInvalidation() {
  function setQueryData(key: string, data: any) {
    queryCache[key] = {
      data,
      timestamp: Date.now(),
      isStale: false
    }
  }

  function getQueryData(key: string) {
    const cached = queryCache[key]
    if (!cached) return null

    const now = Date.now()
    if (now - cached.timestamp > staleTime) {
      cached.isStale = true
    }

    return cached
  }

  function invalidateQuery(key: string) {
    if (queryCache[key]) {
      queryCache[key].isStale = true
    }
  }

  function invalidateQueries(pattern: string) {
    Object.keys(queryCache).forEach((key) => {
      if (key.includes(pattern)) {
        queryCache[key].isStale = true
      }
    })
  }

  function removeQuery(key: string) {
    delete queryCache[key]
  }

  function clearCache() {
    Object.keys(queryCache).forEach((key) => {
      delete queryCache[key]
    })
  }

  return {
    setQueryData,
    getQueryData,
    invalidateQuery,
    invalidateQueries,
    removeQuery,
    clearCache
  }
}
