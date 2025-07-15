import * as S from "../../../src/modules/Separated"
import * as N from "../../../src/modules/Number"
import { describeFunctorLaws } from "../../_utils/describeFunctorLaws"

describeFunctorLaws (S, [S.make ("a", 1)])

describe ("functor", () => {
  describe ("map", () => {
    it ("should apply function to value of `right` property", () => {
      const x = 1
      const n = 1
      expect (S.map (S.make ("a", x), N.add (n))).toEqual (S.make ("a", N.add (x, n)))
    })
  })
})
