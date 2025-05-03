import { Semigroup } from "../../types/Semigroup"
import { Either, fromRight, isLeft, right } from "./either"

type GetSemigroup = <E, A>(semigroup: Semigroup<A>) => Semigroup<Either<E, A>>
export const getSemigroup: GetSemigroup = s => ({
  concat: (mx, my) =>
    isLeft (mx)
      ? isLeft (my)
        ? mx
        : my
      : isLeft (my)
        ? mx
        : right (s.concat (fromRight (mx), fromRight (my))),
})
