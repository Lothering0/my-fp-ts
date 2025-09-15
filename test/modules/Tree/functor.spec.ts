import * as tree from "../../../src/modules/Tree"
import * as number from "../../../src/modules/Number"
import { describeFunctorLaws } from "../../_utils/describeFunctorLaws"
import { pipe } from "../../../src/utils/flow"

describeFunctorLaws (tree.Functor, tree.getEquivalence (number.Equivalence), [
  tree.make (1),
  tree.make (1, [tree.make (2), tree.make (3)]),
  tree.make (1, [tree.make (2, [tree.make (4)]), tree.make (3)]),
])

describe ("functor", () => {
  const Equivalence = tree.getEquivalence (number.Equivalence)

  describe ("map", () => {
    it ("should apply function to value of each node", () => {
      const n = 1
      pipe (
        tree.make (1, [tree.make (2, [tree.make (4)]), tree.make (3)]),
        tree.map (number.add (n)),
        Equivalence.equals (
          tree.make (number.add (1) (n), [
            tree.make (number.add (2) (n), [tree.make (number.add (4) (n))]),
            tree.make (number.add (3) (n)),
          ]),
        ),
        expect,
      ).toBe (true)
    })
  })
})
