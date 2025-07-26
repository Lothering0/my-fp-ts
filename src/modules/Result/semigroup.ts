import { Semigroup } from "../../types/Semigroup"
import { Result, success } from "./result"
import { isFailure } from "./refinements"
import { fromSuccess } from "./utils"
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
        : pipe (S.concat (fromSuccess (mx)) (fromSuccess (my)), success),
})
