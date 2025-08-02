import * as tree from "../../../src/modules/Tree"
import * as number from "../../../src/modules/Number"
import { describeApplicativeLaws } from "../../_utils/describeApplicativeLaws"

describeApplicativeLaws (
  tree.Applicative,
  [
    tree.make (1),
    tree.make (1, [tree.make (2), tree.make (3)]),
    tree.make (1, [tree.make (2, [tree.make (4)]), tree.make (3)]),
  ],
  [
    tree.make (number.add (1)),
    tree.make (number.add (1), [
      tree.make (number.add (2)),
      tree.make (number.add (3)),
    ]),
    tree.make (number.add (1), [
      tree.make (number.add (2), [tree.make (number.add (4))]),
      tree.make (number.add (3)),
    ]),
  ],
)

describe ("applicative", () => {
  describe ("ap", () => {
    it ("should correctly build a tree", () => {
      const fa = tree.make (1, [
        tree.make (2, [tree.make (4)]),
        tree.make (3, [tree.make (5)]),
      ])
      const fab = tree.make (number.add (10), [
        tree.make (number.add (20), [
          tree.make (number.add (40)),
          tree.make (number.add (50)),
        ]),
        tree.make (number.add (30)),
      ])

      expect (tree.ap (fa) (fab)).toEqual<tree.Tree<number>> (
        tree.make (11, [
          tree.make (12, [tree.make (14)]),
          tree.make (13, [tree.make (15)]),
          tree.make (21, [
            tree.make (22, [tree.make (24)]),
            tree.make (23, [tree.make (25)]),
            tree.make (41, [
              tree.make (42, [tree.make (44)]),
              tree.make (43, [tree.make (45)]),
            ]),
            tree.make (51, [
              tree.make (52, [tree.make (54)]),
              tree.make (53, [tree.make (55)]),
            ]),
          ]),
          tree.make (31, [
            tree.make (32, [tree.make (34)]),
            tree.make (33, [tree.make (35)]),
          ]),
        ]),
      )
    })
  })
})
