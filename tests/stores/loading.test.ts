import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLoadingStore } from '@/stores/loading'

describe('useLoadingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('global loading', () => {
    it('should start and stop global loading', () => {
      const store = useLoadingStore()
      
      expect(store.isLoading).toBe(false)
      
      store.startLoading()
      expect(store.isLoading).toBe(true)
      
      store.stopLoading()
      expect(store.isLoading).toBe(false)
    })
  })

  describe('task-specific loading', () => {
    it('should track individual tasks', () => {
      const store = useLoadingStore()
      
      store.startLoading('task1')
      expect(store.isLoading).toBe(true)
      
      store.startLoading('task2')
      expect(store.isLoading).toBe(true)
      
      store.stopLoading('task1')
      expect(store.isLoading).toBe(true)
      
      store.stopLoading('task2')
      expect(store.isLoading).toBe(false)
    })

    it('should handle multiple starts of same task', () => {
      const store = useLoadingStore()
      
      store.startLoading('task1')
      store.startLoading('task1')
      expect(store.isLoading).toBe(true)
      
      store.stopLoading('task1')
      expect(store.isLoading).toBe(false)
    })
  })

  describe('mixed loading', () => {
    it('should handle global and task-specific loading together', () => {
      const store = useLoadingStore()
      
      store.startLoading('task1')
      store.startLoading()
      expect(store.isLoading).toBe(true)
      
      store.stopLoading('task1')
      expect(store.isLoading).toBe(true)
      
      store.stopLoading()
      expect(store.isLoading).toBe(false)
    })
  })

  describe('clearAll', () => {
    it('should clear all loading states', () => {
      const store = useLoadingStore()
      
      store.startLoading('task1')
      store.startLoading('task2')
      store.startLoading()
      expect(store.isLoading).toBe(true)
      
      store.clearAll()
      expect(store.isLoading).toBe(false)
    })
  })
})
