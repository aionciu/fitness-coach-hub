import { describe, it, expect } from 'vitest'

describe('Basic Test Setup', () => {
  it('should run basic tests', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle async operations', async () => {
    const result = await Promise.resolve('test')
    expect(result).toBe('test')
  })

  it('should work with objects', () => {
    const obj = { id: '1', name: 'test' }
    expect(obj).toMatchObject({ id: '1' })
  })
})
