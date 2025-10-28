import { ref, type Ref } from 'vue'
import { useLoadingStore } from '@/stores/loading'

export interface UseApiOptions {
  loadingTaskId?: string
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  immediate?: boolean
}

export function useApi<T, P extends any[]>(
  apiCall: (...args: P) => Promise<T>,
  options: UseApiOptions = {}
) {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const isLoading = ref(false)
  const loadingStore = useLoadingStore()

  async function execute(...args: P): Promise<T | null> {
    try {
      isLoading.value = true
      error.value = null
      
      if (options.loadingTaskId) {
        loadingStore.startLoading(options.loadingTaskId)
      }

      const result = await apiCall(...args)
      data.value = result

      if (options.onSuccess) {
        options.onSuccess(result)
      }

      return result
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      error.value = errorObj

      if (options.onError) {
        options.onError(errorObj)
      }

      return null
    } finally {
      isLoading.value = false
      
      if (options.loadingTaskId) {
        loadingStore.stopLoading(options.loadingTaskId)
      }
    }
  }

  if (options.immediate) {
    execute()
  }

  return {
    data,
    error,
    isLoading,
    execute
  }
}
