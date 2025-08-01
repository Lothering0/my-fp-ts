import { Semigroup } from "../../types/Semigroup"
import { Result, succeed } from "./result"
import { isFailure } from "./refinements"
import { success } from "./utils"
import { pipe } from "../../utils/flow"

export const getSemigroup: {
  <E, A>(S: Semigroup<A>): Semigroup<Result<E, A>>
} = S => ({
  concat: my => mx =>
    isFailure (mx)
      ? isFailure (my)
        ? mx
        : my
      : isFailure (my)
        ? mx
        : pipe (S.concat (success (mx)) (success (my)), succeed),
})
