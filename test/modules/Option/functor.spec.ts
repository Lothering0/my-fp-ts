import * as option from "../../../src/modules/Option"
import * as number from "../../../src/modules/Number"
import { describeFunctorLaws } from "../../_utils/describeFunctorLaws"

describeFunctorLaws (option.Functor, [option.some (1), option.none])

describe ("functor", () => {
  describe ("map", () => {
    it ("should return `none` if it was provided", () => {
      expect (option.map (number.add (1)) (option.none)).toEqual (option.none)
    })

    it ("should apply function to `some` value", () => {
      const a = 1
      const n = 1
      expect (option.map (number.add (n)) (option.some (a))).toEqual (
        option.some (number.add (a) (n)),
      )
    })
  })
})
