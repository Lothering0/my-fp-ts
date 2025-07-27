import * as tree from "../../../src/modules/Tree"
import * as number from "../../../src/modules/Number"
import { describeFunctorLaws } from "../../_utils/describeFunctorLaws"

describeFunctorLaws (tree.Functor, [
  tree.make (1),
  tree.make (1, [tree.make (2), tree.make (3)]),
  tree.make (1, [tree.make (2, [tree.make (4)]), tree.make (3)]),
])

describe ("functor", () => {
  describe ("map", () => {
    it ("should apply function to value of each node", () => {
      const n = 1
      expect (
        tree.map (number.add (n)) (
          tree.make (1, [tree.make (2, [tree.make (4)]), tree.make (3)]),
        ),
      ).toEqual (
        tree.make (number.add (1) (n), [
          tree.make (number.add (2) (n), [tree.make (number.add (4) (n))]),
          tree.make (number.add (3) (n)),
        ]),
      )
    })
  })
})
