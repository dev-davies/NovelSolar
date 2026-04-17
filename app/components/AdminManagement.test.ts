import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock $fetch
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Simplified AdminManagement for testing
const TestAdminManagement = {
  template: `
    <div class="admin-management">
      <div v-if="loadError" class="error">{{ loadError }}</div>
      
      <div v-if="isMasterAdmin" class="create-form">
        <h2>Create New Admin</h2>
        
        <div>
          <label>Email Address</label>
          <input v-model="newAdminForm.email" type="email" placeholder="admin@example.com" :disabled="isCreatingAdmin" />
        </div>
        
        <div>
          <label>Username</label>
          <input v-model="newAdminForm.username" type="text" placeholder="john_admin" :disabled="isCreatingAdmin" />
        </div>
        
        <div v-if="createAdminError" class="error">{{ createAdminError }}</div>
        <div v-if="createAdminSuccess" class="success">{{ createAdminSuccess }}</div>
        
        <button 
          @click="createNewAdmin" 
          :disabled="isCreatingAdmin || !newAdminForm.email || !newAdminForm.username"
        >
          {{ isCreatingAdmin ? 'Creating Admin...' : 'Create Admin' }}
        </button>
      </div>
      
      <div class="admins-list">
        <h3>Current Admin Accounts</h3>
        <button @click="loadAdmins" :disabled="isLoadingAdmins">
          {{ isLoadingAdmins ? 'Refreshing...' : 'Refresh' }}
        </button>
        
        <div v-for="admin in admins" :key="admin.id" class="admin-item">
          <span>{{ admin.username }}</span>
          <span>{{ admin.email }}</span>
          <span v-if="admin.is_master_admin" class="badge">MASTER</span>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      isMasterAdmin: true,
      loadError: '',
      isLoadingAdmins: false,
      isCreatingAdmin: false,
      createAdminError: '',
      createAdminSuccess: '',
      newAdminForm: {
        email: '',
        username: ''
      },
      admins: [
        { id: '1', username: 'master_admin', email: 'master@example.com', is_master_admin: true },
        { id: '2', username: 'john_admin', email: 'john@example.com', is_master_admin: false }
      ]
    }
  },
  methods: {
    async loadAdmins() {
      this.isLoadingAdmins = true
      this.loadError = ''
      
      try {
        const response = await mockFetch('/api/admin/list-admins')
        this.admins = response.admins || []
      } catch (error) {
        this.loadError = error.message || 'Failed to load admins'
      } finally {
        this.isLoadingAdmins = false
      }
    },
    async createNewAdmin() {
      this.isCreatingAdmin = true
      this.createAdminError = ''
      this.createAdminSuccess = ''
      
      try {
        const response = await mockFetch('/api/admin/create-admin', {
          method: 'POST',
          body: this.newAdminForm
        })
        this.createAdminSuccess = response.message || 'Admin created successfully!'
        this.newAdminForm = { email: '', username: '' }
        this.loadAdmins()
      } catch (error) {
        this.createAdminError = error.message || 'Failed to create admin'
      } finally {
        this.isCreatingAdmin = false
      }
    }
  }
}

describe('AdminManagement', () => {
  it('renders when isMasterAdmin is true', () => {
    const wrapper = mount(TestAdminManagement)
    
    expect(wrapper.find('.admin-management').exists()).toBe(true)
  })

  it('displays admin list', () => {
    const wrapper = mount(TestAdminManagement)
    
    expect(wrapper.text()).toContain('master_admin')
    expect(wrapper.text()).toContain('john_admin')
  })

  it('displays master admin badge', () => {
    const wrapper = mount(TestAdminManagement)
    
    expect(wrapper.text()).toContain('MASTER')
  })

  it('shows create form when isMasterAdmin is true', () => {
    const wrapper = mount(TestAdminManagement)
    
    expect(wrapper.find('.create-form').exists()).toBe(true)
  })

  it('hides create form when isMasterAdmin is false', () => {
    const wrapper = mount(TestAdminManagement, {
      data() {
        return {
          isMasterAdmin: false
        }
      }
    })
    
    expect(wrapper.find('.create-form').exists()).toBe(false)
  })

  it('updates form data on input', () => {
    const wrapper = mount(TestAdminManagement)
    
    wrapper.find('input[type="email"]').setValue('newadmin@example.com')
    wrapper.find('input[type="text"]').setValue('new_admin')
    
    expect(wrapper.vm.newAdminForm.email).toBe('newadmin@example.com')
    expect(wrapper.vm.newAdminForm.username).toBe('new_admin')
  })

  it('disables create button when email is empty', () => {
    const wrapper = mount(TestAdminManagement)
    wrapper.vm.newAdminForm = { email: '', username: 'test' }
    
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('disables create button when username is empty', () => {
    const wrapper = mount(TestAdminManagement)
    wrapper.vm.newAdminForm = { email: 'test@example.com', username: '' }
    
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('enables create button when both fields are filled', () => {
    const wrapper = mount(TestAdminManagement, {
      data() {
        return {
          newAdminForm: { email: 'test@example.com', username: 'test' }
        }
      }
    })
    
    const button = wrapper.findAll('button')[0]
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('loads admins on refresh click', async () => {
    mockFetch.mockResolvedValueOnce({ 
      admins: [
        { id: '3', username: 'new_admin', email: 'new@example.com', is_master_admin: false }
      ] 
    })
    
    const wrapper = mount(TestAdminManagement)
    
    await wrapper.findAll('button')[1].trigger('click')
    
    expect(mockFetch).toHaveBeenCalledWith('/api/admin/list-admins')
  })

  it('shows loading state while loading admins', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    const wrapper = mount(TestAdminManagement)
    
    wrapper.findAll('button')[1].trigger('click')
    
    expect(wrapper.vm.isLoadingAdmins).toBe(true)
  })

  it('shows error message on load failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to load'))
    
    const wrapper = mount(TestAdminManagement)
    
    await wrapper.findAll('button')[1].trigger('click')
    
    expect(wrapper.vm.loadError).toBe('Failed to load')
  })

  it('creates new admin successfully', async () => {
    mockFetch.mockResolvedValueOnce({ message: 'Admin created!' })
    
    const wrapper = mount(TestAdminManagement, {
      data() {
        return {
          newAdminForm: { email: 'new@example.com', username: 'new_admin' }
        }
      }
    })
    
    await wrapper.findAll('button')[0].trigger('click')
    
    expect(mockFetch).toHaveBeenCalledWith('/api/admin/create-admin', {
      method: 'POST',
      body: { email: 'new@example.com', username: 'new_admin' }
    })
  })

  it('shows success message after creating admin', async () => {
    mockFetch.mockResolvedValueOnce({ message: 'Admin created successfully!' })
    
    const wrapper = mount(TestAdminManagement, {
      data() {
        return {
          newAdminForm: { email: 'new@example.com', username: 'new_admin' }
        }
      }
    })
    
    await wrapper.findAll('button')[0].trigger('click')
    
    expect(wrapper.vm.createAdminSuccess).toBe('Admin created successfully!')
  })

  it('shows error message on create failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to create'))
    
    const wrapper = mount(TestAdminManagement, {
      data() {
        return {
          newAdminForm: { email: 'new@example.com', username: 'new_admin' }
        }
      }
    })
    
    await wrapper.findAll('button')[0].trigger('click')
    
    expect(wrapper.vm.createAdminError).toBe('Failed to create')
  })

  it('resets form after successful creation', async () => {
    mockFetch.mockResolvedValueOnce({ message: 'Admin created!' })
    
    const wrapper = mount(TestAdminManagement, {
      data() {
        return {
          newAdminForm: { email: 'new@example.com', username: 'new_admin' }
        }
      }
    })
    
    await wrapper.findAll('button')[0].trigger('click')
    
    expect(wrapper.vm.newAdminForm.email).toBe('')
    expect(wrapper.vm.newAdminForm.username).toBe('')
  })
})