import * as R from "../../../src/modules/Result"
import * as N from "../../../src/modules/Number"
import { describeFunctorLaws } from "../../_utils/describeFunctorLaws"

describeFunctorLaws (R.Functor, [R.failure ("a"), R.success (1)])

describe ("functor", () => {
  describe ("map", () => {
    it ("should return `failure` if it was provided", () => {
      const fe = R.failure ("a")
      expect (R.map (N.add (1)) (fe)).toEqual (fe)
    })

    it ("should apply function to `success` value", () => {
      const x = 1
      const n = 1
      expect (R.map (N.add (n)) (R.success (x))).toEqual (R.success (N.add (x) (n)))
    })
  })
})
