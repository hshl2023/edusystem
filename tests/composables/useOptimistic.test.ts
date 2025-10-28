import { describe, it, expect, vi } from 'vitest'
import { useOptimistic } from '@/composables/useOptimistic'

describe('useOptimistic', () => {
  it('should update data optimistically', async () => {
    const initialData = { id: 1, name: 'John' }
    const { data, optimisticUpdate } = useOptimistic(initialData)

    expect(data.value).toEqual(initialData)

    const newData = { id: 1, name: 'Jane' }
    const mockApiCall = vi.fn().mockResolvedValue(undefined)

    optimisticUpdate(newData, mockApiCall)

    expect(data.value).toEqual(newData)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(mockApiCall).toHaveBeenCalled()
  })

  it('should rollback on error', async () => {
    const initialData = { id: 1, name: 'John' }
    const { data, optimisticUpdate } = useOptimistic(initialData)

    const newData = { id: 1, name: 'Jane' }
    const mockApiCall = vi.fn().mockRejectedValue(new Error('API Error'))

    optimisticUpdate(newData, mockApiCall)

    expect(data.value).toEqual(newData)

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(data.value).toEqual(initialData)
  })

  it('should call onSuccess callback', async () => {
    const initialData = { id: 1, name: 'John' }
    const { optimisticUpdate } = useOptimistic(initialData)

    const newData = { id: 1, name: 'Jane' }
    const mockApiCall = vi.fn().mockResolvedValue({ success: true })
    const onSuccess = vi.fn()

    optimisticUpdate(newData, mockApiCall, { onSuccess })

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(onSuccess).toHaveBeenCalledWith({ success: true })
  })

  it('should call onError callback with rollback data', async () => {
    const initialData = { id: 1, name: 'John' }
    const { optimisticUpdate } = useOptimistic(initialData)

    const newData = { id: 1, name: 'Jane' }
    const mockError = new Error('API Error')
    const mockApiCall = vi.fn().mockRejectedValue(mockError)
    const onError = vi.fn()

    optimisticUpdate(newData, mockApiCall, { onError })

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(onError).toHaveBeenCalledWith(mockError, initialData)
  })
})
