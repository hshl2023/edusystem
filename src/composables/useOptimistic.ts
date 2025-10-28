import { ref, type Ref } from 'vue'

export interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error, rollbackData: T) => void
}

export function useOptimistic<T>(initialData: T) {
  const data = ref(initialData) as Ref<T>
  const previousData = ref<T>(initialData) as Ref<T>

  function optimisticUpdate(
    newData: T,
    apiCall: () => Promise<any>,
    options: OptimisticUpdateOptions<T> = {}
  ) {
    previousData.value = JSON.parse(JSON.stringify(data.value))
    data.value = newData

    apiCall()
      .then((result) => {
        if (options.onSuccess) {
          options.onSuccess(result)
        }
      })
      .catch((error) => {
        data.value = previousData.value
        
        if (options.onError) {
          options.onError(error, previousData.value)
        }
      })
  }

  function rollback() {
    data.value = previousData.value
  }

  return {
    data,
    optimisticUpdate,
    rollback
  }
}
