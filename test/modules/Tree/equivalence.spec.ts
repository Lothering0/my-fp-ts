import { Number, Tree } from '../../../src'

interface TestCase {
  readonly description: string
  readonly tree1: Tree.Tree<number>
  readonly tree2: Tree.Tree<number>
  readonly expected: boolean
}

describe('getEquivalence', () => {
  const Equivalence = Tree.getEquivalence(Number.Equivalence)

  const testCases: TestCase[] = [
    {
      description:
        'should return `false` for trees with different values and without forest',
      tree1: Tree.make(0),
      tree2: Tree.make(1),
      expected: false,
    },
    {
      description:
        'should return `true` for trees with same values and without forest',
      tree1: Tree.make(1),
      tree2: Tree.make(1),
      expected: true,
    },
    {
      description:
        'should return `false` for trees with same values but different forests',
      tree1: Tree.make(1, [Tree.make(1), Tree.make(2)]),
      tree2: Tree.make(1),
      expected: false,
    },
    {
      description:
        'should return `true` for trees with same values and same forests',
      tree1: Tree.make(1, [Tree.make(1), Tree.make(2)]),
      tree2: Tree.make(1, [Tree.make(1), Tree.make(2)]),
      expected: true,
    },
    {
      description: 'should return `false` for different deep trees',
      tree1: Tree.make(1, [
        Tree.make(2),
        Tree.make(2, [Tree.make(4)]),
        Tree.make(3),
      ]),
      tree2: Tree.make(1, [
        Tree.make(2, [Tree.make(2), Tree.make(4)]),
        Tree.make(3),
      ]),
      expected: false,
    },
    {
      description: 'should return `true` for same deep trees',
      tree1: Tree.make(1, [
        Tree.make(2),
        Tree.make(2, [Tree.make(4)]),
        Tree.make(3),
      ]),
      tree2: Tree.make(1, [
        Tree.make(2),
        Tree.make(2, [Tree.make(4)]),
        Tree.make(3),
      ]),
      expected: true,
    },
  ]

  testCases.forEach(({ description, tree1, tree2, expected }) =>
    it(description, () =>
      expect(Equivalence.equals(tree1)(tree2)).toBe(expected),
    ),
  )
})
