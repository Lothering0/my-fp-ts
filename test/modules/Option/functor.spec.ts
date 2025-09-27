import { Number, Option } from '../../../src'
import { describeFunctorLaws } from '../../_utils/describeFunctorLaws'

describeFunctorLaws(Option.Functor, Option.getEquivalence(Number.Equivalence), [
  Option.none,
  Option.some(1),
])

describe('functor', () => {
  describe('map', () => {
    it('should return `none` if it was provided', () => {
      expect(Option.map(Number.add(1))(Option.none)).toEqual(Option.none)
    })

    it('should apply function to `some` value', () => {
      const a = 1
      const n = 1
      expect(Option.map(Number.add(n))(Option.some(a))).toEqual(
        Option.some(Number.add(a)(n)),
      )
    })
  })
})
