import { Number, Result, String } from '../../../src'
import { describeFunctorLaws } from '../../_utils/describeFunctorLaws'

describeFunctorLaws(
  Result.Functor,
  Result.getEquivalence(String.Equivalence, Number.Equivalence),
  [Result.fail('e'), Result.succeed(1)],
)

describe('functor', () => {
  describe('map', () => {
    it('should return `failure` if it was provided', () => {
      const fe = Result.fail('e')
      expect(Result.map(Number.add(1))(fe)).toEqual(fe)
    })

    it('should apply function to `success` value', () => {
      const a = 1
      const n = 1
      expect(Result.map(Number.add(n))(Result.succeed(a))).toEqual(
        Result.succeed(Number.add(a)(n)),
      )
    })
  })
})
