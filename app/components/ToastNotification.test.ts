import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('~/composables/useToast', () => ({
  useToast: vi.fn().mockReturnValue({
    removeToast: vi.fn()
  })
}))

import ToastNotification from './ToastNotification.vue'

describe('ToastNotification', () => {
  it('renders toast title', () => {
    const toast = { id: '1', title: 'Test Title', message: 'Test message', type: 'info' as const }
    const wrapper = mount(ToastNotification, { props: { toast } })

    expect(wrapper.text()).toContain('Test Title')
  })

  it('renders toast message', () => {
    const toast = { id: '1', title: 'Test Title', message: 'Test message', type: 'info' as const }
    const wrapper = mount(ToastNotification, { props: { toast } })

    expect(wrapper.text()).toContain('Test message')
  })

  it('shows the success icon for success type', () => {
    const toast = { id: '1', title: 'Success', message: 'Operation successful', type: 'success' as const }
    const wrapper = mount(ToastNotification, { props: { toast } })

    expect(wrapper.text()).toContain('check_circle')
  })

  it('shows the error icon for error type', () => {
    const toast = { id: '1', title: 'Error', message: 'Something went wrong', type: 'error' as const }
    const wrapper = mount(ToastNotification, { props: { toast } })

    expect(wrapper.text()).toContain('error')
  })

  it('shows the info icon for info type', () => {
    const toast = { id: '1', title: 'Info', message: 'Some information', type: 'info' as const }
    const wrapper = mount(ToastNotification, { props: { toast } })

    expect(wrapper.text()).toContain('info')
  })

  it('renders a close button', () => {
    const toast = { id: '1', title: 'Test', message: 'Test message', type: 'info' as const }
    const wrapper = mount(ToastNotification, { props: { toast } })

    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('applies success type classes', () => {
    const toast = { id: '1', title: 'Success', message: 'Success message', type: 'success' as const }
    const wrapper = mount(ToastNotification, { props: { toast } })

    const classes = wrapper.attributes('class') || ''
    expect(classes).toContain('bg-green-50')
    expect(classes).toContain('border-green-200')
  })

  it('applies error type classes', () => {
    const toast = { id: '1', title: 'Error', message: 'Error message', type: 'error' as const }
    const wrapper = mount(ToastNotification, { props: { toast } })

    const classes = wrapper.attributes('class') || ''
    expect(classes).toContain('bg-red-50')
    expect(classes).toContain('border-red-200')
  })

  it('applies info type classes', () => {
    const toast = { id: '1', title: 'Info', message: 'Info message', type: 'info' as const }
    const wrapper = mount(ToastNotification, { props: { toast } })

    const classes = wrapper.attributes('class') || ''
    expect(classes).toContain('bg-blue-50')
    expect(classes).toContain('border-blue-200')
  })
})
