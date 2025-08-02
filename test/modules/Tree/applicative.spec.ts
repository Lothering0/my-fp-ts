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

      expect (tree.ap (fa) (fab)).toEqual<tree.Tree<number>> ({
        value: 11,
        forest: [
          { value: 12, forest: [{ value: 14, forest: [] }] },
          { value: 13, forest: [{ value: 15, forest: [] }] },
          {
            value: 21,
            forest: [
              { value: 22, forest: [{ value: 24, forest: [] }] },
              { value: 23, forest: [{ value: 25, forest: [] }] },
              {
                value: 41,
                forest: [
                  { value: 42, forest: [{ value: 44, forest: [] }] },
                  { value: 43, forest: [{ value: 45, forest: [] }] },
                ],
              },
              {
                value: 51,
                forest: [
                  { value: 52, forest: [{ value: 54, forest: [] }] },
                  { value: 53, forest: [{ value: 55, forest: [] }] },
                ],
              },
            ],
          },
          {
            value: 31,
            forest: [
              { value: 32, forest: [{ value: 34, forest: [] }] },
              { value: 33, forest: [{ value: 35, forest: [] }] },
            ],
          },
        ],
      })
    })
  })
})
