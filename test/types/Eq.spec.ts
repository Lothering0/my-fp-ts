import * as eq from "../../src/types/Eq"

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

describe ("Eq", () => {
  describe ("EqStrict", () => {
    describe ("equals", () => {
      it ("should satisfy reflexivity law", () => {
        permutations.forEach (({ a }) => {
          expect (eq.EqStrict.equals (a) (a) === true).toBe (true)
        })
      })

      it ("should satisfy symmetry law", () => {
        permutations.forEach (({ a, b }) => {
          expect (eq.EqStrict.equals (a) (b) === eq.EqStrict.equals (b) (a)).toBe (
            true,
          )
        })
      })

      it ("should satisfy transitivity law", () => {
        permutations.forEach (({ a, b, c }) => {
          const ab = eq.EqStrict.equals (a) (b) === true
          const bc = eq.EqStrict.equals (b) (c) === true
          const ac = eq.EqStrict.equals (a) (c) === true
          if (ab && bc) expect (ac).toBe (true)
        })
      })
    })
  })
})
