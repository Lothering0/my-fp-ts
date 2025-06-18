import * as O from "./option"
import * as E from "../Either"
import { createMonad, Monad } from "../../types/Monad"
import { map } from "./functor"
import { applicative } from "./applicative"
import { identity } from "../Identity"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const monad: Monad<O.URI> = createMonad ({
  ...applicative,
  flat: O.match (() => O.none, identity),
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
): O.Option<A> =>
  pipe (
    ma,
    map (f),
    flatMap (
      E.match (
        () => O.none,
        () => ma,
      ),
    ),
  )

export const tapEither: TapEither = overload (tapEitherPointed)
