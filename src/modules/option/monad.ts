import * as O from "./option"
import * as E from "../either"
import { createMonad, Monad } from "../../types/Monad"
import { map } from "./functor"
import { applicative } from "./applicative"
import { identity } from "../identity"
import { pipe } from "../../utils/flow"
import { overloadWithPointFree } from "../../utils/points"

export const monad: Monad<"Option"> = createMonad ({
  ...applicative,
  flat: O.option (() => O.none, identity),
})

export const {
  Do,
  flat,
  flatMap,
  compose,
  setTo,
  mapTo,
  applyTo,
  applyResultTo,
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
      E.either (
        () => O.none,
        () => ma,
      ),
    ),
  )

export const tapEither: TapEither = overloadWithPointFree (tapEitherPointed)
