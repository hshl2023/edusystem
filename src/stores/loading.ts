import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const loadingTasks = ref<Set<string>>(new Set())
  const globalLoading = ref(false)

  const isLoading = computed(() => loadingTasks.value.size > 0 || globalLoading.value)

  function startLoading(taskId?: string) {
    if (taskId) {
      loadingTasks.value.add(taskId)
    } else {
      globalLoading.value = true
    }
  }

  function stopLoading(taskId?: string) {
    if (taskId) {
      loadingTasks.value.delete(taskId)
    } else {
      globalLoading.value = false
    }
  }

  function clearAll() {
    loadingTasks.value.clear()
    globalLoading.value = false
  }

  return {
    isLoading,
    startLoading,
    stopLoading,
    clearAll
  }
})
