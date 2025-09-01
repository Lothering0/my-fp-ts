import { Semigroup } from "../../typeclasses/Semigroup"
import { Result, succeed } from "./result"
import { isFailure } from "./refinements"
import { success } from "./utils"
import { pipe } from "../../utils/flow"

export const getSemigroup: {
  <E, A>(Semigroup: Semigroup<A>): Semigroup<Result<E, A>>
} = Semigroup => ({
  combine: my => mx =>
    isFailure (mx)
      ? isFailure (my)
        ? mx
        : my
      : isFailure (my)
        ? mx
        : pipe (Semigroup.combine (success (mx)) (success (my)), succeed),
})
