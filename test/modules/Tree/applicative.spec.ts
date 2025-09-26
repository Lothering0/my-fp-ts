import { number, pipe, tree } from '../../../src'
import { describeApplicativeLaws } from '../../_utils/describeApplicativeLaws'

describeApplicativeLaws(
  tree.Applicative,
  tree.getEquivalence(number.Equivalence),
  [
    tree.make(1),
    tree.make(1, [tree.make(2), tree.make(3)]),
    tree.make(1, [tree.make(2, [tree.make(4)]), tree.make(3)]),
  ],
  [
    tree.make(number.add(10)),
    tree.make(number.add(10), [
      tree.make(number.add(20)),
      tree.make(number.add(30)),
    ]),
    tree.make(number.add(10), [
      tree.make(number.add(20), [tree.make(number.add(40))]),
      tree.make(number.add(30)),
    ]),
  ],
)

describe('applicative', () => {
  const Equivalence = tree.getEquivalence(number.Equivalence)

  describe('ap', () => {
    it('should correctly build a tree', () => {
      const fa = tree.make(1, [
        tree.make(2, [tree.make(4)]),
        tree.make(3, [tree.make(5)]),
      ])
      const fab = tree.make(number.add(10), [
        tree.make(number.add(20), [
          tree.make(number.add(40)),
          tree.make(number.add(50)),
        ]),
        tree.make(number.add(30)),
      ])

      pipe(
        fab,
        tree.ap(fa),
        Equivalence.equals(
          tree.make(11, [
            tree.make(12, [tree.make(14)]),
            tree.make(13, [tree.make(15)]),
            tree.make(21, [
              tree.make(22, [tree.make(24)]),
              tree.make(23, [tree.make(25)]),
              tree.make(41, [
                tree.make(42, [tree.make(44)]),
                tree.make(43, [tree.make(45)]),
              ]),
              tree.make(51, [
                tree.make(52, [tree.make(54)]),
                tree.make(53, [tree.make(55)]),
              ]),
            ]),
            tree.make(31, [
              tree.make(32, [tree.make(34)]),
              tree.make(33, [tree.make(35)]),
            ]),
          ]),
        ),
        expect,
      ).toBe(true)
    })
  })
})
