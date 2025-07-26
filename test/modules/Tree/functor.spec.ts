import * as Tr from "../../../src/modules/Tree"
import * as N from "../../../src/modules/Number"
import { describeFunctorLaws } from "../../_utils/describeFunctorLaws"

describeFunctorLaws (Tr.Functor, [
  Tr.make (1),
  Tr.make (1, [Tr.make (2), Tr.make (3)]),
  Tr.make (1, [Tr.make (2, [Tr.make (4)]), Tr.make (3)]),
])

describe ("functor", () => {
  describe ("map", () => {
    it ("should apply function to value of each node", () => {
      const n = 1
      expect (
        Tr.map (N.add (n)) (Tr.make (1, [Tr.make (2, [Tr.make (4)]), Tr.make (3)])),
      ).toEqual (
        Tr.make (N.add (1) (n), [
          Tr.make (N.add (2) (n), [Tr.make (N.add (4) (n))]),
          Tr.make (N.add (3) (n)),
        ]),
      )
    })
  })
})
