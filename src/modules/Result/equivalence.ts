import { Equivalence } from "../../typeclasses/Equivalence"
import { Result } from "./result"
import { match } from "./matchers"
import { constFalse } from "../../utils/constant"
import { pipe } from "../../utils/flow"

export const getEquivalence: {
  <E, A>(
    EquivalenceE: Equivalence<E>,
    EquivalenceA: Equivalence<A>,
  ): Equivalence<Result<E, A>>
} = (EquivalenceE, EquivalenceA) => ({
  equals: mx => my =>
    pipe (
      mx,
      match ({
        onFailure: x =>
          match ({
            onFailure: EquivalenceE.equals (x),
            onSuccess: constFalse,
          }) (my),
        onSuccess: x =>
          match ({
            onFailure: constFalse,
            onSuccess: EquivalenceA.equals (x),
          }) (my),
      }),
    ),
})
