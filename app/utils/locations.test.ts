import { describe, it, expect } from 'vitest'
import { branches, getDistance, nigerianStates } from './locations'

describe('locations', () => {
  describe('branches', () => {
    it('has at least one branch', () => {
      expect(branches.length).toBeGreaterThan(0)
    })

    it('head office is first branch', () => {
      expect(branches[0].name).toContain('Head Office')
      expect(branches[0].city).toBe('Ibadan')
      expect(branches[0].state).toBe('Oyo')
    })

    it('each branch has required fields', () => {
      branches.forEach(branch => {
        expect(branch.name).toBeDefined()
        expect(branch.city).toBeDefined()
        expect(branch.state).toBeDefined()
        expect(branch.address).toBeDefined()
        expect(branch.coords).toBeDefined()
        expect(branch.coords).toHaveLength(2)
      })
    })

    it('each branch has valid coordinates', () => {
      branches.forEach(branch => {
        const [lat, lon] = branch.coords
        expect(lat).toBeGreaterThanOrEqual(-90)
        expect(lat).toBeLessThanOrEqual(90)
        expect(lon).toBeGreaterThanOrEqual(-180)
        expect(lon).toBeLessThanOrEqual(180)
      })
    })

    it('contains branches from multiple states', () => {
      const states = new Set(branches.map(b => b.state))
      expect(states.size).toBeGreaterThan(5)
    })

    it('head office has contact information', () => {
      const headOffice = branches[0]
      expect(headOffice.phone).toBeDefined()
      expect(headOffice.email1).toBeDefined()
      expect(headOffice.hoursWeekdays).toBeDefined()
    })
  })

  describe('getDistance', () => {
    it('returns 0 for same coordinates', () => {
      const distance = getDistance(7.3964, 3.8724, 7.3964, 3.8724)
      expect(distance).toBe(0)
    })

    it('calculates distance between Ibadan and Lagos correctly', () => {
      // Ibadan to Lagos is approximately 120km
      const distance = getDistance(7.3964, 3.8724, 6.6018, 3.3515)
      expect(distance).toBeGreaterThan(100)
      expect(distance).toBeLessThan(150)
    })

    it('calculates distance between two points in Nigeria', () => {
      // Ibadan to Abuja is approximately 400km
      const distance = getDistance(7.3964, 3.8724, 9.1538, 7.3220)
      expect(distance).toBeGreaterThan(350)
      expect(distance).toBeLessThan(450)
    })

    it('is symmetric (A to B equals B to A)', () => {
      const distance1 = getDistance(7.3964, 3.8724, 6.6018, 3.3515)
      const distance2 = getDistance(6.6018, 3.3515, 7.3964, 3.8724)
      expect(Math.abs(distance1 - distance2)).toBeLessThan(0.001)
    })

    it('handles negative coordinates', () => {
      // Test with coordinates that could have negative values
      const distance = getDistance(-33.8688, 151.2093, -34.6037, -58.3816) // Sydney to Buenos Aires
      expect(distance).toBeGreaterThan(10000)
    })
  })

  describe('nigerianStates', () => {
    it('has multiple states', () => {
      expect(nigerianStates.length).toBeGreaterThan(20)
    })

    it('each state has name and coordinates', () => {
      nigerianStates.forEach(state => {
        expect(state.name).toBeDefined()
        expect(state.coords).toBeDefined()
        expect(state.coords).toHaveLength(2)
      })
    })

    it('contains common states like Lagos and Kano', () => {
      const stateNames = nigerianStates.map(s => s.name)
      expect(stateNames).toContain('Lagos')
      expect(stateNames).toContain('Kano')
      expect(stateNames).toContain('Oyo')
      expect(stateNames).toContain('Ogun')
    })

    it('each state has valid coordinates within Nigeria', () => {
      nigerianStates.forEach(state => {
        const [lat, lon] = state.coords
        // Nigeria roughly between lat 4-14, lon 2-15
        expect(lat).toBeGreaterThanOrEqual(4)
        expect(lat).toBeLessThanOrEqual(14)
        expect(lon).toBeGreaterThanOrEqual(2)
        expect(lon).toBeLessThanOrEqual(15)
      })
    })
  })
})