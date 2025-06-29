import { Semigroup } from "../../types/Semigroup"
import { Either, right } from "./either"
import { isLeft, fromRight } from "./utils"
import { pipe } from "../../utils/flow"

export const getSemigroup: {
  <E, A>(semigroup: Semigroup<A>): Semigroup<Either<E, A>>
} = s => ({
  concat: (mx, my) =>
    isLeft (mx)
      ? isLeft (my)
        ? mx
        : my
      : isLeft (my)
        ? mx
        : pipe (s.concat (fromRight (mx), fromRight (my)), right),
})
