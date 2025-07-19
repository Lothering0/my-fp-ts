import * as O from "./option"
import * as R from "../Result"
import { createMonad } from "../../types/Monad"
import { map } from "./functor"
import { Applicative } from "./applicative"
import { identity } from "../Identity"
import { match } from "./utils"
import { zero } from "./alternative"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { constant } from "../../utils/constant"

export const Monad = createMonad<O.OptionHKT> ({
  ...Applicative,
  flat: match (zero, identity),
})

export const {
  Do,
  flat,
  flatMap,
  compose,
  setTo,
  mapTo,
  applyTo,
  apS,
  flatMapTo,
  tap,
  tapSync,
} = Monad

export const tapResult: {
  <E, A, _>(afe: (a: A) => R.Result<E, _>): (self: O.Option<A>) => O.Option<A>
  <E, A, _>(self: O.Option<A>, afe: (a: A) => R.Result<E, _>): O.Option<A>
} = overload (
  1,
  <E, A, _>(self: O.Option<A>, afe: (a: A) => R.Result<E, _>): O.Option<A> =>
    pipe (self, map (afe), flatMap (R.match (zero, constant (self)))),
)
