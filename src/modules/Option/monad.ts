import * as O from "./option"
import * as E from "../Either"
import { createMonad, Monad } from "../../types/Monad"
import { map } from "./functor"
import { applicative } from "./applicative"
import { identity } from "../Identity"
import { match, zero } from "./utils"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { constant } from "../../utils/constant"

export const monad: Monad<O.OptionHKT> = createMonad ({
  ...applicative,
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
  tapIo,
} = monad

export const tapEither: {
  <E, A, _>(afe: (a: A) => E.Either<E, _>): (self: O.Option<A>) => O.Option<A>
  <E, A, _>(self: O.Option<A>, afe: (a: A) => E.Either<E, _>): O.Option<A>
} = overload (
  1,
  <E, A, _>(self: O.Option<A>, afe: (a: A) => E.Either<E, _>): O.Option<A> =>
    pipe (self, map (afe), flatMap (E.match (zero, constant (self)))),
)
