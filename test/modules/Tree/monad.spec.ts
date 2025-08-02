import * as tree from "../../../src/modules/Tree"
import { pipe } from "../../../src/utils/flow"
import { describeMonadLaws } from "../../_utils/describeMonadLaws"

describeMonadLaws (
  tree.Monad,
  [
    tree.make (1),
    tree.make (1, [tree.make (2), tree.make (3)]),
    tree.make (1, [tree.make (2, [tree.make (4)]), tree.make (3)]),
  ],
  [
    a => tree.make (a + 10),
    a => tree.make (a + 10, [tree.make (a + 20)]),
    a =>
      tree.make (a + 10, [
        tree.make (a + 20, [tree.make (a + 40)]),
        tree.make (a + 30),
      ]),
  ],
  [
    a => tree.make (a / 2),
    a => tree.make (a / 2, [tree.make (a / 3)]),
    a =>
      tree.make (a / 2, [
        tree.make (a / 3, [tree.make (a / 5)]),
        tree.make (a / 5),
      ]),
  ],
)

describe ("monad", () => {
  describe ("flatMap", () => {
    it ("should correctly build a tree", () => {
      const fa = tree.make (1, [tree.make (2, [tree.make (4)]), tree.make (3)])
      const result = pipe (
        fa,
        tree.flatMap (a => tree.make (a + 10, [tree.make (a + 20)])),
      )

      expect (result).toEqual<tree.Tree<number>> (
        tree.make (11, [
          tree.make (21),
          tree.make (12, [tree.make (22), tree.make (14, [tree.make (24)])]),
          tree.make (13, [tree.make (23)]),
        ]),
      )
    })
  })
})
