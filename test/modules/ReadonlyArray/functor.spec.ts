import { number, array } from '../../../src'
import { describeFunctorLaws } from '../../_utils/describeFunctorLaws'

describeFunctorLaws(array.Functor, array.getEquivalence(number.Equivalence), [
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

      expect(array.map(number.add(n))([])).toEqual([])
      expect(array.map(number.add(n))([x])).toEqual([number.add(x)(n)])
      expect(array.map(number.add(n))([x, y, z])).toEqual([
        number.add(x)(n),
        number.add(y)(n),
        number.add(z)(n),
      ])
    })
  })
})
