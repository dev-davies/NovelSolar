import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock $fetch
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Simplified BookingModal for testing
const TestBookingModal = {
  template: `
    <div v-if="isOpen" class="modal">
      <div v-if="isSuccess" class="success">
        <h2>Booking Received!</h2>
        <p>Thank you, {{ form.firstName }}. Your request for {{ form.serviceType }} has been sent.</p>
        <button @click="closeModal">Done</button>
      </div>
      
      <div v-else class="form">
        <h2>Book a Service</h2>
        
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        
        <form @submit.prevent="submitBooking">
          <div class="row">
            <input v-model="form.firstName" placeholder="First Name" required />
            <input v-model="form.lastName" placeholder="Last Name" required />
          </div>
          <input v-model="form.email" type="email" placeholder="Email" required />
          <input v-model="form.phone" placeholder="Phone" required />
          <input v-model="form.address" placeholder="Address" required />
          <input v-model="form.preferredDate" type="date" required />
          <input v-model="form.serviceType" placeholder="Service Type" />
          <textarea v-model="form.details" placeholder="Additional Details"></textarea>
          
          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Book Now' }}
          </button>
        </form>
      </div>
    </div>
  `,
  props: {
    isOpen: Boolean,
    serviceName: {
      type: String,
      default: 'General Service'
    }
  },
  emits: ['close'],
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        preferredDate: '',
        serviceType: this.serviceName,
        details: ''
      },
      isSubmitting: false,
      isSuccess: false,
      errorMessage: ''
    }
  },
  watch: {
    serviceName(newVal) {
      this.form.serviceType = newVal
    }
  },
  methods: {
    async submitBooking() {
      this.isSubmitting = true
      this.errorMessage = ''
      
      try {
        await mockFetch('/api/book-service', {
          method: 'POST',
          body: this.form
        })
        this.isSuccess = true
      } catch (error) {
        this.errorMessage = error.message || 'An error occurred. Please try again.'
      } finally {
        this.isSubmitting = false
      }
    },
    closeModal() {
      if (!this.isSubmitting) {
        setTimeout(() => { 
          this.isSuccess = false
          this.errorMessage = '' 
        }, 300)
        this.$emit('close')
      }
    }
  }
}

describe('BookingModal', () => {
  it('renders when isOpen is true', () => {
    const wrapper = mount(TestBookingModal, {
      props: { isOpen: true }
    })
    
    expect(wrapper.find('.modal').exists()).toBe(true)
  })

  it('does not render when isOpen is false', () => {
    const wrapper = mount(TestBookingModal, {
      props: { isOpen: false }
    })
    
    expect(wrapper.find('.modal').exists()).toBe(false)
  })

  it('displays form fields', () => {
    const wrapper = mount(TestBookingModal, {
      props: { isOpen: true }
    })
    
    expect(wrapper.find('input[placeholder="First Name"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Email"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Phone"]').exists()).toBe(true)
  })

  it('updates form data on input', () => {
    const wrapper = mount(TestBookingModal, {
      props: { isOpen: true }
    })
    
    wrapper.find('input[placeholder="First Name"]').setValue('John')
    wrapper.find('input[placeholder="Email"]').setValue('john@example.com')
    
    expect(wrapper.vm.form.firstName).toBe('John')
    expect(wrapper.vm.form.email).toBe('john@example.com')
  })

  it('submits form successfully', async () => {
    mockFetch.mockResolvedValueOnce({ success: true })
    
    const wrapper = mount(TestBookingModal, {
      props: { isOpen: true }
    })
    
    wrapper.find('input[placeholder="First Name"]').setValue('John')
    wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
    wrapper.find('input[placeholder="Email"]').setValue('john@example.com')
    wrapper.find('input[placeholder="Phone"]').setValue('1234567890')
    wrapper.find('input[placeholder="Address"]').setValue('123 Main St')
    wrapper.find('input[type="date"]').setValue('2024-12-25')
    
    await wrapper.find('form').trigger('submit')
    
    expect(mockFetch).toHaveBeenCalledWith('/api/book-service', {
      method: 'POST',
      body: wrapper.vm.form
    })
  })

  it('shows success state after successful submission', async () => {
    mockFetch.mockResolvedValueOnce({ success: true })
    
    const wrapper = mount(TestBookingModal, {
      props: { isOpen: true }
    })
    
    // Fill required fields
    wrapper.find('input[placeholder="First Name"]').setValue('John')
    wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
    wrapper.find('input[placeholder="Email"]').setValue('john@example.com')
    wrapper.find('input[placeholder="Phone"]').setValue('1234567890')
    wrapper.find('input[placeholder="Address"]').setValue('123 Main St')
    wrapper.find('input[type="date"]').setValue('2024-12-25')
    
    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.isSuccess).toBe(true)
    expect(wrapper.find('.success').exists()).toBe(true)
  })

  it('shows error message on failed submission', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Server error'))
    
    const wrapper = mount(TestBookingModal, {
      props: { isOpen: true }
    })
    
    // Fill required fields
    wrapper.find('input[placeholder="First Name"]').setValue('John')
    wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
    wrapper.find('input[placeholder="Email"]').setValue('john@example.com')
    wrapper.find('input[placeholder="Phone"]').setValue('1234567890')
    wrapper.find('input[placeholder="Address"]').setValue('123 Main St')
    wrapper.find('input[type="date"]').setValue('2024-12-25')
    
    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.errorMessage).toBe('Server error')
    expect(wrapper.find('.error').exists()).toBe(true)
  })

  it('updates serviceType when serviceName prop changes', async () => {
    const wrapper = mount(TestBookingModal, {
      props: { isOpen: true, serviceName: 'Initial Service' }
    })
    
    expect(wrapper.vm.form.serviceType).toBe('Initial Service')
    
    await wrapper.setProps({ serviceName: 'Updated Service' })
    
    expect(wrapper.vm.form.serviceType).toBe('Updated Service')
  })

  it('disables submit button while submitting', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    const wrapper = mount(TestBookingModal, {
      props: { isOpen: true }
    })
    
    // Fill required fields
    wrapper.find('input[placeholder="First Name"]').setValue('John')
    wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
    wrapper.find('input[placeholder="Email"]').setValue('john@example.com')
    wrapper.find('input[placeholder="Phone"]').setValue('1234567890')
    wrapper.find('input[placeholder="Address"]').setValue('123 Main St')
    wrapper.find('input[type="date"]').setValue('2024-12-25')
    
    wrapper.find('form').trigger('submit')
    
    expect(wrapper.vm.isSubmitting).toBe(true)
  })

  it('displays user name in success message', async () => {
    mockFetch.mockResolvedValueOnce({ success: true })
    
    const wrapper = mount(TestBookingModal, {
      props: { isOpen: true }
    })
    
    wrapper.find('input[placeholder="First Name"]').setValue('John')
    wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
    wrapper.find('input[placeholder="Email"]').setValue('john@example.com')
    wrapper.find('input[placeholder="Phone"]').setValue('1234567890')
    wrapper.find('input[placeholder="Address"]').setValue('123 Main St')
    wrapper.find('input[type="date"]').setValue('2024-12-25')
    
    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('John')
  })
})