import { Equivalence } from '../../typeclasses/Equivalence'
import { Result } from './result'
import { match } from './matchers'
import { constFalse } from '../../utils/constant'
import { pipe } from '../../utils/flow'

export const getEquivalence: {
  <A, E>(
    EquivalenceA: Equivalence<A>,
    EquivalenceE: Equivalence<E>,
  ): Equivalence<Result<A, E>>
} = (EquivalenceA, EquivalenceE) => ({
  equals: mx => my =>
    pipe(
      mx,
      match({
        onFailure: x =>
          match({
            onFailure: EquivalenceE.equals(x),
            onSuccess: constFalse,
          })(my),
        onSuccess: x =>
          match({
            onFailure: constFalse,
            onSuccess: EquivalenceA.equals(x),
          })(my),
      }),
    ),
})
