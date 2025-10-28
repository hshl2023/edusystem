import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useApi } from '@/composables/useApi'

describe('useApi', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should execute API call successfully', async () => {
    const mockApiCall = vi.fn().mockResolvedValue({ id: 1, name: 'Test' })

    const { data, error, isLoading, execute } = useApi(mockApiCall)

    expect(data.value).toBeNull()
    expect(error.value).toBeNull()
    expect(isLoading.value).toBe(false)

    const result = await execute()

    expect(mockApiCall).toHaveBeenCalled()
    expect(data.value).toEqual({ id: 1, name: 'Test' })
    expect(error.value).toBeNull()
    expect(isLoading.value).toBe(false)
    expect(result).toEqual({ id: 1, name: 'Test' })
  })

  it('should handle API call error', async () => {
    const mockError = new Error('API Error')
    const mockApiCall = vi.fn().mockRejectedValue(mockError)

    const { data, error, isLoading, execute } = useApi(mockApiCall)

    const result = await execute()

    expect(mockApiCall).toHaveBeenCalled()
    expect(data.value).toBeNull()
    expect(error.value).toEqual(mockError)
    expect(isLoading.value).toBe(false)
    expect(result).toBeNull()
  })

  it('should call onSuccess callback', async () => {
    const mockData = { id: 1, name: 'Test' }
    const mockApiCall = vi.fn().mockResolvedValue(mockData)
    const onSuccess = vi.fn()

    const { execute } = useApi(mockApiCall, { onSuccess })

    await execute()

    expect(onSuccess).toHaveBeenCalledWith(mockData)
  })

  it('should call onError callback', async () => {
    const mockError = new Error('API Error')
    const mockApiCall = vi.fn().mockRejectedValue(mockError)
    const onError = vi.fn()

    const { execute } = useApi(mockApiCall, { onError })

    await execute()

    expect(onError).toHaveBeenCalledWith(mockError)
  })

  it('should execute immediately when immediate option is true', async () => {
    const mockApiCall = vi.fn().mockResolvedValue({ id: 1, name: 'Test' })

    useApi(mockApiCall, { immediate: true })

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockApiCall).toHaveBeenCalled()
  })

  it('should pass arguments to API call', async () => {
    const mockApiCall = vi.fn().mockResolvedValue({ id: 1, name: 'Test' })

    const { execute } = useApi(mockApiCall)

    await execute('arg1', 'arg2', 123)

    expect(mockApiCall).toHaveBeenCalledWith('arg1', 'arg2', 123)
  })
})
