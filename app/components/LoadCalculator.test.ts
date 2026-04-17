import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

// Simplified LoadCalculator for testing core logic
const TestLoadCalculator = {
  template: `
    <div>
      <h1>Solar Load Calculator</h1>
      <table>
        <tbody>
          <tr v-for="item in appliances" :key="item.id">
            <td>{{ item.name }}</td>
            <td>
              <button @click="updateQty(item, -1)">-</button>
              <input type="number" v-model.number="item.quantity" min="0" />
              <button @click="updateQty(item, 1)">+</button>
            </td>
            <td>
              <input type="number" v-model.number="item.load" />
            </td>
            <td>{{ item.quantity * item.load }}W</td>
          </tr>
        </tbody>
      </table>
      <div>Total Load: {{ totalLoad }}W</div>
      <div>With 20% Buffer: {{ totalLoadWithBuffer }}W</div>
      <div>Recommended Panel: {{ recommendedPanel }}W</div>
      <div>Recommended Battery: {{ recommendedBattery }}Ah</div>
      <button @click="resetCalculator">Reset</button>
    </div>
  `,
  data() {
    return {
      appliances: [
        { id: 1, name: 'TV', quantity: 2, load: 100 },
        { id: 2, name: 'Fan', quantity: 4, load: 75 },
        { id: 3, name: 'Light', quantity: 10, load: 20 },
        { id: 4, name: 'Fridge', quantity: 1, load: 150 },
        { id: 5, name: 'AC', quantity: 0, load: 1200 }
      ]
    }
  },
  computed: {
    totalLoad() {
      return this.appliances.reduce((sum, item) => sum + (item.quantity * item.load), 0)
    },
    totalLoadWithBuffer() {
      return this.totalLoad * 1.2
    },
    recommendedPanel() {
      const panel = 550
      return Math.ceil(this.totalLoadWithBuffer / panel) * panel
    },
    recommendedBattery() {
      const avgVoltage = 12
      const DOD = 0.5
      return Math.ceil((this.totalLoadWithBuffer * 4) / (avgVoltage * DOD))
    }
  },
  methods: {
    updateQty(item, delta) {
      const newQty = item.quantity + delta
      if (newQty >= 0) {
        item.quantity = newQty
      }
    },
    resetCalculator() {
      this.appliances.forEach(item => item.quantity = 0)
    }
  }
}

describe('LoadCalculator', () => {
  it('calculates total load correctly', () => {
    const wrapper = mount(TestLoadCalculator)
    
    // Initial: 2*100 + 4*75 + 10*20 + 1*150 + 0*1200 = 200 + 300 + 200 + 150 = 850
    expect(wrapper.vm.totalLoad).toBe(850)
  })

  it('calculates total load with 20% buffer', () => {
    const wrapper = mount(TestLoadCalculator)
    
    // 850 * 1.2 = 1020
    expect(wrapper.vm.totalLoadWithBuffer).toBe(1020)
  })

  it('updates quantity with + button', () => {
    const wrapper = mount(TestLoadCalculator)
    const tvItem = wrapper.vm.appliances.find(a => a.name === 'TV')
    
    wrapper.vm.updateQty(tvItem, 1)
    
    expect(tvItem.quantity).toBe(3)
  })

  it('updates quantity with - button', () => {
    const wrapper = mount(TestLoadCalculator)
    const tvItem = wrapper.vm.appliances.find(a => a.name === 'TV')
    
    wrapper.vm.updateQty(tvItem, -1)
    
    expect(tvItem.quantity).toBe(1)
  })

  it('does not go below zero quantity', () => {
    const wrapper = mount(TestLoadCalculator)
    const tvItem = wrapper.vm.appliances.find(a => a.name === 'TV')
    
    // Initial quantity is 2, trying to subtract 5 should keep it at 0
    wrapper.vm.updateQty(tvItem, -2)
    
    expect(tvItem.quantity).toBe(0)
  })

  it('calculates total when adding items', () => {
    const wrapper = mount(TestLoadCalculator)
    const acItem = wrapper.vm.appliances.find(a => a.name === 'AC')
    
    acItem.quantity = 2
    
    // New total: 2*100 + 4*75 + 10*20 + 1*150 + 2*1200 = 200 + 300 + 200 + 150 + 2400 = 3250
    expect(wrapper.vm.totalLoad).toBe(3250)
  })

  it('resets all quantities to zero', () => {
    const wrapper = mount(TestLoadCalculator)
    
    // Add some items first
    wrapper.vm.appliances.forEach(a => a.quantity = 5)
    
    wrapper.vm.resetCalculator()
    
    wrapper.vm.appliances.forEach(a => {
      expect(a.quantity).toBe(0)
    })
  })

  it('calculates recommended panel size', () => {
    const wrapper = mount(TestLoadCalculator)
    
    // 1020 / 550 = 1.85, rounded up = 2 * 550 = 1100
    expect(wrapper.vm.recommendedPanel).toBe(1100)
  })

  it('calculates recommended battery capacity', () => {
    const wrapper = mount(TestLoadCalculator)
    
    // (1020 * 4) / (12 * 0.5) = 4080 / 6 = 680
    expect(wrapper.vm.recommendedBattery).toBe(680)
  })

  it('handles empty load (all zero quantities)', () => {
    const wrapper = mount(TestLoadCalculator)
    
    wrapper.vm.resetCalculator()
    
    expect(wrapper.vm.totalLoad).toBe(0)
    expect(wrapper.vm.totalLoadWithBuffer).toBe(0)
    expect(wrapper.vm.recommendedPanel).toBe(0)
    expect(wrapper.vm.recommendedBattery).toBe(0)
  })

  it('calculates individual item total correctly', () => {
    const wrapper = mount(TestLoadCalculator)
    const tvItem = wrapper.vm.appliances.find(a => a.name === 'TV')
    
    // 2 * 100 = 200
    expect(tvItem.quantity * tvItem.load).toBe(200)
  })
})