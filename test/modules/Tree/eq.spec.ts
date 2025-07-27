import * as tree from "../../../src/modules/Tree"
import * as number from "../../../src/modules/Number"

interface TestCase {
  readonly description: string
  readonly tree1: tree.Tree<number>
  readonly tree2: tree.Tree<number>
  readonly expected: boolean
}

describe ("getEq", () => {
  const Eq = tree.getEq (number.Eq)

  const testCases: TestCase[] = [
    {
      description:
        "should return `false` for trees with different values and without forest",
      tree1: tree.make (0),
      tree2: tree.make (1),
      expected: false,
    },
    {
      description:
        "should return `true` for trees with same values and without forest",
      tree1: tree.make (1),
      tree2: tree.make (1),
      expected: true,
    },
    {
      description:
        "should return `false` for trees with same values but different forests",
      tree1: tree.make (1, [tree.make (1), tree.make (2)]),
      tree2: tree.make (1),
      expected: false,
    },
    {
      description:
        "should return `true` for trees with same values and same forests",
      tree1: tree.make (1, [tree.make (1), tree.make (2)]),
      tree2: tree.make (1, [tree.make (1), tree.make (2)]),
      expected: true,
    },
    {
      description: "should return `false` for different deep trees",
      tree1: tree.make (1, [
        tree.make (2),
        tree.make (2, [tree.make (4)]),
        tree.make (3),
      ]),
      tree2: tree.make (1, [tree.make (2, [tree.make (4)]), tree.make (3)]),
      expected: false,
    },
    {
      description: "should return `true` for same deep trees",
      tree1: tree.make (1, [
        tree.make (2),
        tree.make (2, [tree.make (4)]),
        tree.make (3),
      ]),
      tree2: tree.make (1, [
        tree.make (2),
        tree.make (2, [tree.make (4)]),
        tree.make (3),
      ]),
      expected: true,
    },
  ]

  testCases.forEach (({ description, tree1, tree2, expected }) =>
    it (description, () => expect (Eq.equals (tree1) (tree2)).toBe (expected)),
  )
})
