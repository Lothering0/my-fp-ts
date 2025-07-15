import * as O from "../../../src/modules/Option"
import * as N from "../../../src/modules/Number"
import { describeFunctorLaws } from "../../_utils/describeFunctorLaws"

describeFunctorLaws (O, [O.some (1), O.none])

describe ("functor", () => {
  describe ("map", () => {
    it ("should return `none` if it was provided", () => {
      expect (O.map (O.none, N.add (1))).toEqual (O.none)
    })

    it ("should apply function to `some` value", () => {
      const x = 1
      const n = 1
      expect (O.map (O.some (x), N.add (n))).toEqual (O.some (N.add (x, n)))
    })
  })
})
