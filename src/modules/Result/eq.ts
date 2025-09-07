import { Eq } from "../../typeclasses/Eq"
import { Result } from "./result"
import { match } from "./matchers"
import { constFalse } from "../../utils/constant"
import { pipe } from "../../utils/flow"

export const getEq: {
  <E, A>(EqE: Eq<E>, EqA: Eq<A>): Eq<Result<E, A>>
} = (EqE, EqA) => ({
  equals: mx => my =>
    pipe (
      mx,
      match ({
        onFailure: x =>
          match ({
            onFailure: EqE.equals (x),
            onSuccess: constFalse,
          }) (my),
        onSuccess: x =>
          match ({
            onFailure: constFalse,
            onSuccess: EqA.equals (x),
          }) (my),
      }),
    ),
})
