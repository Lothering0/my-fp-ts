import { Number, pipe, Tree } from '../../../src'
import { describeMonadLaws } from '../../_utils/describeMonadLaws'

describeMonadLaws(
  Tree.Monad,
  Tree.getEquivalence(Number.Equivalence),
  [
    Tree.make(1),
    Tree.make(1, [Tree.make(2), Tree.make(3)]),
    Tree.make(1, [Tree.make(2, [Tree.make(4)]), Tree.make(3)]),
  ],
  [
    a => Tree.make(a + 10),
    a => Tree.make(a + 10, [Tree.make(a + 20)]),
    a =>
      Tree.make(a + 10, [
        Tree.make(a + 20, [Tree.make(a + 40)]),
        Tree.make(a + 30),
      ]),
  ],
  [
    a => Tree.make(a / 2),
    a => Tree.make(a / 2, [Tree.make(a / 3)]),
    a =>
      Tree.make(a / 2, [
        Tree.make(a / 3, [Tree.make(a / 5)]),
        Tree.make(a / 5),
      ]),
  ],
)

describe('monad', () => {
  const Equivalence = Tree.getEquivalence(Number.Equivalence)

  describe('flatMap', () => {
    it('should correctly build a tree', () => {
      const fa = Tree.make(1, [Tree.make(2, [Tree.make(4)]), Tree.make(3)])

      pipe(
        fa,
        Tree.flatMap(a => Tree.make(a + 10, [Tree.make(a + 20)])),
        Equivalence.equals(
          Tree.make(11, [
            Tree.make(21),
            Tree.make(12, [Tree.make(22), Tree.make(14, [Tree.make(24)])]),
            Tree.make(13, [Tree.make(23)]),
          ]),
        ),
        expect,
      ).toBe(true)
    })
  })
})
