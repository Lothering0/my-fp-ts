import { Equivalence } from '../../src'

const permutations = [
  { a: 0, b: 0, c: 0 },
  { a: 0, b: 0, c: 1 },
  { a: 0, b: 1, c: 0 },
  { a: 1, b: 0, c: 0 },
  { a: 0, b: 1, c: 1 },
  { a: 1, b: 1, c: 0 },
  { a: 1, b: 0, c: 1 },
  { a: 1, b: 1, c: 1 },
]

describe('Equivalence', () => {
  describe('EquivalenceStrict', () => {
    describe('equals', () => {
      it('should satisfy reflexivity law', () => {
        permutations.forEach(({ a }) => {
          expect(Equivalence.EquivalenceStrict.equals(a)(a) === true).toBe(true)
        })
      })

      it('should satisfy symmetry law', () => {
        permutations.forEach(({ a, b }) => {
          expect(
            Equivalence.EquivalenceStrict.equals(a)(b) ===
              Equivalence.EquivalenceStrict.equals(b)(a),
          ).toBe(true)
        })
      })

      it('should satisfy transitivity law', () => {
        permutations.forEach(({ a, b, c }) => {
          const ab = Equivalence.EquivalenceStrict.equals(a)(b) === true
          const bc = Equivalence.EquivalenceStrict.equals(b)(c) === true
          const ac = Equivalence.EquivalenceStrict.equals(a)(c) === true
          if (ab && bc) expect(ac).toBe(true)
        })
      })
    })
  })
})
