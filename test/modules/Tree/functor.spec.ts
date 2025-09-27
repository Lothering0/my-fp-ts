import { Number, pipe, Tree } from '../../../src'
import { describeFunctorLaws } from '../../_utils/describeFunctorLaws'

describeFunctorLaws(Tree.Functor, Tree.getEquivalence(Number.Equivalence), [
  Tree.make(1),
  Tree.make(1, [Tree.make(2), Tree.make(3)]),
  Tree.make(1, [Tree.make(2, [Tree.make(4)]), Tree.make(3)]),
])

describe('functor', () => {
  const Equivalence = Tree.getEquivalence(Number.Equivalence)

  describe('map', () => {
    it('should apply function to value of each node', () => {
      const n = 1
      pipe(
        Tree.make(1, [Tree.make(2, [Tree.make(4)]), Tree.make(3)]),
        Tree.map(Number.add(n)),
        Equivalence.equals(
          Tree.make(Number.add(1)(n), [
            Tree.make(Number.add(2)(n), [Tree.make(Number.add(4)(n))]),
            Tree.make(Number.add(3)(n)),
          ]),
        ),
        expect,
      ).toBe(true)
    })
  })
})
