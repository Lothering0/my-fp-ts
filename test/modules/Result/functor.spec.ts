import * as result from "../../../src/modules/Result"
import * as number from "../../../src/modules/Number"
import { describeFunctorLaws } from "../../_utils/describeFunctorLaws"

describeFunctorLaws (result.Functor, [result.fail ("e"), result.succeed (1)])

describe ("functor", () => {
  describe ("map", () => {
    it ("should return `failure` if it was provided", () => {
      const fe = result.fail ("e")
      expect (result.map (number.add (1)) (fe)).toEqual (fe)
    })

    it ("should apply function to `success` value", () => {
      const a = 1
      const n = 1
      expect (result.map (number.add (n)) (result.succeed (a))).toEqual (
        result.succeed (number.add (a) (n)),
      )
    })
  })
})
