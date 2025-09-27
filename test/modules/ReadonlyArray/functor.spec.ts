import { Number, Array } from '../../../src'
import { describeFunctorLaws } from '../../_utils/describeFunctorLaws'

describeFunctorLaws(Array.Functor, Array.getEquivalence(Number.Equivalence), [
  [],
  [1],
  [1, 2, 3],
])

describe('functor', () => {
  describe('map', () => {
    it('should proceed each value in provided array', () => {
      const x = 1
      const y = 2
      const z = 3
      const n = 1

      expect(Array.map(Number.add(n))([])).toEqual([])
      expect(Array.map(Number.add(n))([x])).toEqual([Number.add(x)(n)])
      expect(Array.map(Number.add(n))([x, y, z])).toEqual([
        Number.add(x)(n),
        Number.add(y)(n),
        Number.add(z)(n),
      ])
    })
  })
})
