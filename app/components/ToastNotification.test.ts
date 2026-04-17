import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock the useToast composable
vi.mock('~/composables/useToast', () => ({
  useToast: vi.fn().mockReturnValue({
    removeToast: vi.fn()
  })
}))

import ToastNotification from './ToastNotification.vue'

describe('ToastNotification', () => {
  it('renders toast title', () => {
    const toast = { id: '1', title: 'Test Title', message: 'Test message', type: 'info' }
    const wrapper = mount(ToastNotification, {
      props: { toast }
    })
    
    expect(wrapper.text()).toContain('Test Title')
  })

  it('renders toast message', () => {
    const toast = { id: '1', title: 'Test Title', message: 'Test message', type: 'info' }
    const wrapper = mount(ToastNotification, {
      props: { toast }
    })
    
    expect(wrapper.text()).toContain('Test message')
  })

  it('renders success icon for success type', () => {
    const toast = { id: '1', title: 'Success', message: 'Operation successful', type: 'success' }
    const wrapper = mount(ToastNotification, {
      props: { toast }
    })
    
    const icon = wrapper.find('.material-symbols-outlined')
    expect(icon.exists()).toBe(true)
  })

  it('renders error icon for error type', () => {
    const toast = { id: '1', title: 'Error', message: 'Something went wrong', type: 'error' }
    const wrapper = mount(ToastNotification, {
      props: { toast }
    })
    
    const icon = wrapper.find('.material-symbols-outlined')
    expect(icon.exists()).toBe(true)
  })

  it('renders info icon for info type', () => {
    const toast = { id: '1', title: 'Info', message: 'Some information', type: 'info' }
    const wrapper = mount(ToastNotification, {
      props: { toast }
    })
    
    const icon = wrapper.find('.material-symbols-outlined')
    expect(icon.exists()).toBe(true)
  })

  it('has close button', () => {
    const toast = { id: '1', title: 'Test', message: 'Test message', type: 'info' }
    const wrapper = mount(ToastNotification, {
      props: { toast }
    })
    
    const closeButton = wrapper.find('button[aria-label="Close notification"]')
    expect(closeButton.exists()).toBe(true)
  })

  it('applies correct border color for success type', () => {
    const toast = { id: '1', title: 'Success', message: 'Success message', type: 'success' }
    const wrapper = mount(ToastNotification, {
      props: { toast }
    })
    
    const classes = wrapper.attributes('class') || ''
    expect(classes).toContain('border-green-500')
  })

  it('applies correct border color for error type', () => {
    const toast = { id: '1', title: 'Error', message: 'Error message', type: 'error' }
    const wrapper = mount(ToastNotification, {
      props: { toast }
    })
    
    const classes = wrapper.attributes('class') || ''
    expect(classes).toContain('border-red-500')
  })

  it('applies correct border color for info type', () => {
    const toast = { id: '1', title: 'Info', message: 'Info message', type: 'info' }
    const wrapper = mount(ToastNotification, {
      props: { toast }
    })
    
    const classes = wrapper.attributes('class') || ''
    expect(classes).toContain('border-blue-500')
  })
})