import * as RA from "../../../src/modules/ReadonlyArray"
import * as N from "../../../src/modules/Number"
import { describeFunctorLaws } from "../../_utils/describeFunctorLaws"

describeFunctorLaws (RA, [[], [1], [1, 2, 3]])

describe ("functor", () => {
  describe ("map", () => {
    it ("should proceed each value in provided array", () => {
      const x = 1
      const y = 2
      const z = 3
      const n = 1

      expect (RA.map ([], N.add (n))).toEqual ([])
      expect (RA.map ([x], N.add (n))).toEqual ([N.add (x, n)])
      expect (RA.map ([x, y, z], N.add (n))).toEqual ([
        N.add (x, n),
        N.add (y, n),
        N.add (z, n),
      ])
    })
  })
})
