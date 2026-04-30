import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ErrorBoundary from './ErrorBoundary.vue'

describe('ErrorBoundary', () => {
  it('should render slot content when no error', () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: '<div>Content</div>'
      }
    })

    expect(wrapper.text()).toContain('Content')
    expect(wrapper.find('.error-boundary').exists()).toBe(false)
  })

  it('should show default fallback when a child throws', async () => {
    const Thrower = {
      setup() {
        throw new Error('Boom')
      },
      template: '<div />'
    }

    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: Thrower as never
      }
    })

    await nextTick()

    expect(wrapper.find('.error-boundary').exists()).toBe(true)
    expect(wrapper.text()).toContain('Something went wrong')
    expect(wrapper.text()).toContain('Boom')
  })

  it('should render fallback slot with error and clearError', async () => {
    const Thrower = {
      setup() {
        throw new Error('Custom failure')
      },
      template: '<div />'
    }

    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: Thrower as never,
        fallback: `<template #fallback="{ error, clearError }">
          <div class="custom-fallback">{{ error.message }}</div>
        </template>`
      }
    })

    await nextTick()

    expect(wrapper.find('.custom-fallback').exists()).toBe(true)
    expect(wrapper.text()).toContain('Custom failure')
  })

  it('should expose Try Again button in the default fallback', async () => {
    const Thrower = {
      setup() {
        throw new Error('Test error')
      },
      template: '<div />'
    }

    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: Thrower as never
      }
    })

    await nextTick()

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Try Again')
  })
})
