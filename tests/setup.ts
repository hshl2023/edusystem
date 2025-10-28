import { vi } from 'vitest'

global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

global.alert = vi.fn()

Object.defineProperty(window, 'location', {
  value: {
    href: '',
    pathname: '/'
  },
  writable: true
})
