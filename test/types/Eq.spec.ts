import * as Eq from "../../src/types/Eq"

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
      permutations.forEach (({ a, b, c }) => {
        it ("should satisfy reflexivity law", () => {
          expect (Eq.EqStrict.equals (a, a) === true).toBe (true)
        })

        it ("should satisfy symmetry law", () => {
          expect (Eq.EqStrict.equals (a, b) === Eq.EqStrict.equals (b, a)).toBe (
            true,
          )
        })

        it ("should satisfy transitivity law", () => {
          const ab = Eq.EqStrict.equals (a, b) === true
          const bc = Eq.EqStrict.equals (b, c) === true
          const ac = Eq.EqStrict.equals (a, c) === true
          if (ab && bc) expect (ac).toBe (true)
        })
      })
    })
  })
})
