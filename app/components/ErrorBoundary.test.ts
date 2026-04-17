import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorBoundary from './ErrorBoundary.vue'

// Mock useErrorLogger
vi.mock('~/composables/useErrorLogger', () => ({
  useErrorLogger: () => ({
    trackVueError: vi.fn()
  })
}))

// Mock Nuxt components
vi.mock('#components/NuxtLink', () => ({
  default: {
    name: 'NuxtLink',
    template: '<a :href="to"><slot /></a>',
    props: ['to']
  }
}))

// Mock auto-imports that ErrorBoundary uses
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue') as any
  return {
    ...actual,
    ref: actual.ref,
    computed: actual.computed,
    withDefaults: actual.withDefaults,
    defineProps: actual.defineProps,
    defineEmits: actual.defineEmits,
    onMounted: actual.onMounted,
    onErrorCaptured: actual.onErrorCaptured
  }
})

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

  it('should show fallback when error is set', async () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: '<div>Content</div>',
        fallback: '<template #fallback="{ error }"><div>Error Fallback {{ error.message }}</div></template>'
      }
    })

    const vm = wrapper.vm as any
    vm.setError(new Error('Test error'))

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Error Fallback Test error')
  })

  it('should display default error title for generic errors', async () => {
    const wrapper = mount(ErrorBoundary, {
      props: {
        fallback: true
      }
    })

    const vm = wrapper.vm as any
    vm.setError(new Error('Something went wrong'))

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Something Went Wrong')
  })

  it('should display "Page Not Found" for 404 errors', async () => {
    const wrapper = mount(ErrorBoundary, {
      props: {
        fallback: true
      }
    })

    const vm = wrapper.vm as any
    vm.setError(new Error('404 Not Found'))

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Page Not Found')
  })

  it('should display "Server Error" for 500 errors', async () => {
    const wrapper = mount(ErrorBoundary, {
      props: {
        fallback: true
      }
    })

    const vm = wrapper.vm as any
    vm.setError(new Error('500 Internal Server Error'))

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Server Error')
  })

  it('should not show retry button for 404 errors', async () => {
    const wrapper = mount(ErrorBoundary, {
      props: {
        fallback: true
      }
    })

    const vm = wrapper.vm as any
    vm.setError(new Error('404 Not Found'))

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.btn-retry').exists()).toBe(false)
  })

  it('should show retry button for other errors', async () => {
    const wrapper = mount(ErrorBoundary, {
      props: {
        fallback: true
      }
    })

    const vm = wrapper.vm as any
    vm.setError(new Error('Network error'))

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.btn-retry').exists()).toBe(true)
  })

  it('should clear error when retry is clicked', async () => {
    const wrapper = mount(ErrorBoundary, {
      props: {
        fallback: true
      }
    })

    const vm = wrapper.vm as any
    vm.setError(new Error('Test error'))

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Something Went Wrong')

    await wrapper.find('.btn-retry').trigger('click')
    await wrapper.vm.$nextTick()

    expect(vm.error).toBeNull()
  })

  it('should expose setError and clearError methods', () => {
    const wrapper = mount(ErrorBoundary)

    const vm = wrapper.vm as any
    expect(typeof vm.setError).toBe('function')
    expect(typeof vm.clearError).toBe('function')
  })

  it('should have working retry method', () => {
    const wrapper = mount(ErrorBoundary)

    const vm = wrapper.vm as any
    vm.setError(new Error('Test'))
    vm.retry()

    expect(vm.error).toBeNull()
  })
})
