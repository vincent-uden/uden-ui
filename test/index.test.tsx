import { createRoot, createSignal } from 'solid-js'
import { isServer } from 'solid-js/web'
import { describe, expect, it } from 'vitest'
import { Hello, createHello } from '../src'

describe('environment', () => {
  it('runs on server', () => {
    expect(typeof window).toBe('object')
    expect(isServer).toBe(false)
  })
})

describe('createHello', () => {
  it('Returns a Hello World signal', () =>
    createRoot(dispose => {
      const [hello] = createHello()
      expect(hello()).toBe('Hello World!')
      dispose()
    }))

  it('Changes the hello target', () =>
    createRoot(dispose => {
      const [hello, setHello] = createHello()
      setHello('Solid')
      expect(hello()).toBe('Hello Solid!')
      dispose()
    }))
})
