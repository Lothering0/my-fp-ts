import * as O from "../../../src/modules/Option"
import * as N from "../../../src/modules/Number"
import { describeFunctorLaws } from "../../_utils/describeFunctorLaws"

describeFunctorLaws (O.Functor, [O.some (1), O.none])

describe ("functor", () => {
  describe ("map", () => {
    it ("should return `none` if it was provided", () => {
      expect (O.map (N.add (1)) (O.none)).toEqual (O.none)
    })

    it ("should apply function to `some` value", () => {
      const x = 1
      const n = 1
      expect (O.map (N.add (n)) (O.some (x))).toEqual (O.some (N.add (x) (n)))
    })
  })
})
