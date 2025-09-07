import * as boolean from "../Boolean"
import { Eq } from "../../typeclasses/Eq"
import { Semigroup } from "../../typeclasses/Semigroup"
import { pipe } from "../../utils/flow"
import { reduce } from "./foldable"
import { append, concat, elem } from "./utils"

export const getSemigroup = <A>(): Semigroup<ReadonlyArray<A>> => ({
  combine: concat,
})

export const getIntersectionSemigroup = <A>(
  Eq: Eq<A>,
): Semigroup<ReadonlyArray<A>> => ({
  combine: ys =>
    reduce ([] as ReadonlyArray<A>, (out, x) =>
      pipe (
        ys,
        elem (Eq) (x),
        boolean.match ({
          onFalse: () => out,
          onTrue: () => pipe (out, append (x)),
        }),
      ),
    ),
})
