import { Semigroup } from "../../types/Semigroup"
import { Result, success } from "./result"
import { isFailure, fromSuccess } from "./utils"
import { pipe } from "../../utils/flow"

export const getSemigroup: {
  <E, A>(semigroup: Semigroup<A>): Semigroup<Result<E, A>>
} = s => ({
  concat: (mx, my) =>
    isFailure (mx)
      ? isFailure (my)
        ? mx
        : my
      : isFailure (my)
        ? mx
        : pipe (s.concat (fromSuccess (mx), fromSuccess (my)), success),
})
