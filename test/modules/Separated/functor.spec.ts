import * as separated from "../../../src/modules/Separated"
import * as number from "../../../src/modules/Number"
import { describeFunctorLaws } from "../../_utils/describeFunctorLaws"

describeFunctorLaws (separated.Functor, [separated.make ("a", 1)])

describe ("functor", () => {
  describe ("map", () => {
    it ("should apply function to value of `right` property", () => {
      const a = 1
      const n = 1
      expect (separated.map (number.add (n)) (separated.make ("a", a))).toEqual (
        separated.make ("a", number.add (a) (n)),
      )
    })
  })
})
