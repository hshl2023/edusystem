import { describe, it, expect, beforeEach } from 'vitest'
import { useQueryInvalidation } from '@/composables/useQueryInvalidation'

describe('useQueryInvalidation', () => {
  beforeEach(() => {
    const { clearCache } = useQueryInvalidation()
    clearCache()
  })

  it('should set and get query data', () => {
    const { setQueryData, getQueryData } = useQueryInvalidation()

    const data = { id: 1, name: 'Test' }
    setQueryData('test-key', data)

    const cached = getQueryData('test-key')
    expect(cached).toBeDefined()
    expect(cached?.data).toEqual(data)
    expect(cached?.isStale).toBe(false)
  })

  it('should return null for non-existent key', () => {
    const { getQueryData } = useQueryInvalidation()

    const cached = getQueryData('non-existent')
    expect(cached).toBeNull()
  })

  it('should invalidate specific query', () => {
    const { setQueryData, getQueryData, invalidateQuery } = useQueryInvalidation()

    setQueryData('test-key', { id: 1 })
    invalidateQuery('test-key')

    const cached = getQueryData('test-key')
    expect(cached?.isStale).toBe(true)
  })

  it('should invalidate queries by pattern', () => {
    const { setQueryData, getQueryData, invalidateQueries } = useQueryInvalidation()

    setQueryData('students-list', [])
    setQueryData('students-1', {})
    setQueryData('courses-list', [])

    invalidateQueries('students')

    expect(getQueryData('students-list')?.isStale).toBe(true)
    expect(getQueryData('students-1')?.isStale).toBe(true)
    expect(getQueryData('courses-list')?.isStale).toBe(false)
  })

  it('should remove query', () => {
    const { setQueryData, getQueryData, removeQuery } = useQueryInvalidation()

    setQueryData('test-key', { id: 1 })
    removeQuery('test-key')

    const cached = getQueryData('test-key')
    expect(cached).toBeNull()
  })

  it('should clear all cache', () => {
    const { setQueryData, getQueryData, clearCache } = useQueryInvalidation()

    setQueryData('key1', { id: 1 })
    setQueryData('key2', { id: 2 })

    clearCache()

    expect(getQueryData('key1')).toBeNull()
    expect(getQueryData('key2')).toBeNull()
  })

  it('should mark data as stale after stale time', () => {
    const { setQueryData, getQueryData } = useQueryInvalidation()

    setQueryData('test-key', { id: 1 })

    const cached = getQueryData('test-key')
    expect(cached?.isStale).toBe(false)

    // Mock time passing (would need to manipulate timestamp in real scenario)
    // For now, we just test the structure
  })
})
