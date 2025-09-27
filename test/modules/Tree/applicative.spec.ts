import { Number, pipe, Tree } from '../../../src'
import { describeApplicativeLaws } from '../../_utils/describeApplicativeLaws'

describeApplicativeLaws(
  Tree.Applicative,
  Tree.getEquivalence(Number.Equivalence),
  [
    Tree.make(1),
    Tree.make(1, [Tree.make(2), Tree.make(3)]),
    Tree.make(1, [Tree.make(2, [Tree.make(4)]), Tree.make(3)]),
  ],
  [
    Tree.make(Number.add(10)),
    Tree.make(Number.add(10), [
      Tree.make(Number.add(20)),
      Tree.make(Number.add(30)),
    ]),
    Tree.make(Number.add(10), [
      Tree.make(Number.add(20), [Tree.make(Number.add(40))]),
      Tree.make(Number.add(30)),
    ]),
  ],
)

describe('applicative', () => {
  const Equivalence = Tree.getEquivalence(Number.Equivalence)

  describe('ap', () => {
    it('should correctly build a tree', () => {
      const fa = Tree.make(1, [
        Tree.make(2, [Tree.make(4)]),
        Tree.make(3, [Tree.make(5)]),
      ])
      const fab = Tree.make(Number.add(10), [
        Tree.make(Number.add(20), [
          Tree.make(Number.add(40)),
          Tree.make(Number.add(50)),
        ]),
        Tree.make(Number.add(30)),
      ])

      pipe(
        fab,
        Tree.ap(fa),
        Equivalence.equals(
          Tree.make(11, [
            Tree.make(12, [Tree.make(14)]),
            Tree.make(13, [Tree.make(15)]),
            Tree.make(21, [
              Tree.make(22, [Tree.make(24)]),
              Tree.make(23, [Tree.make(25)]),
              Tree.make(41, [
                Tree.make(42, [Tree.make(44)]),
                Tree.make(43, [Tree.make(45)]),
              ]),
              Tree.make(51, [
                Tree.make(52, [Tree.make(54)]),
                Tree.make(53, [Tree.make(55)]),
              ]),
            ]),
            Tree.make(31, [
              Tree.make(32, [Tree.make(34)]),
              Tree.make(33, [Tree.make(35)]),
            ]),
          ]),
        ),
        expect,
      ).toBe(true)
    })
  })
})
