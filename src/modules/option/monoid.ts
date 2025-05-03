import { Option, none, isNone, some, fromSome } from "./option"
import { Monoid } from "../../types/Monoid"
import { Semigroup } from "../../types/Semigroup"

type GetMonoid = <A>(semigroup: Semigroup<A>) => Monoid<Option<A>>
export const getMonoid: GetMonoid = s => ({
  empty: none,
  concat: (mx, my) =>
    isNone (mx)
      ? isNone (my)
        ? none
        : my
      : isNone (my)
        ? mx
        : some (s.concat (fromSome (mx), fromSome (my))),
})
