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

export const monad: Monad<O.URI> = createMonad ({
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

interface TapEitherPointed {
  <E, A, _>(ma: O.Option<A>, f: (a: A) => E.Either<E, _>): O.Option<A>
}

interface TapEither extends TapEitherPointed {
  <E, A, _>(f: (a: A) => E.Either<E, _>): (ma: O.Option<A>) => O.Option<A>
}

const tapEitherPointed: TapEitherPointed = <E, A, _>(
  ma: O.Option<A>,
  f: (a: A) => E.Either<E, _>,
): O.Option<A> => pipe (ma, map (f), flatMap (E.match (zero, constant (ma))))

export const tapEither: TapEither = overload (1, tapEitherPointed)
