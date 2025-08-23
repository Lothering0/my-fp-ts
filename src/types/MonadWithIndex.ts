/* eslint-disable @typescript-eslint/no-explicit-any */
import { DoObject, DoObjectKey } from "./DoObject"
import { Hkt, Kind } from "./Hkt"
import { flow, pipe } from "../utils/flow"
import { ApplicativeWithIndex } from "./ApplicativeWithIndex"
import { Monad } from "./Monad"

export interface MonadWithIndex<F extends Hkt, I>
  extends ApplicativeWithIndex<F, I>,
    Monad<F> {
  readonly flatMapWithIndex: <S, E1, A, B>(
    aimb: (a: A, i: I) => Kind<F, S, E1, B>,
  ) => <E2>(self: Kind<F, S, E2, A>) => Kind<F, S, E1 | E2, B>

  readonly composeWithIndex: <S, E1, E2, A, B, C>(
    bimc: (b: B, i: I) => Kind<F, S, E2, C>,
    aimb: (a: A) => Kind<F, S, E1, B>,
  ) => (a: A) => Kind<F, S, E1 | E2, C>

  readonly mapToWithIndex: <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A, i: I) => B,
  ) => <S, E>(self: Kind<F, S, E, A>) => Kind<F, S, E, DoObject<N, A, B>>

  readonly flapToWithIndex: <N extends DoObjectKey, S, E1, A, B>(
    name: Exclude<N, keyof A>,
    fab: Kind<F, S, E1, (a: A, i: I) => B>,
  ) => <E2>(self: Kind<F, S, E2, A>) => Kind<F, S, E1 | E2, DoObject<N, A, B>>

  readonly flatMapToWithIndex: <N extends DoObjectKey, S, E1, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A, i: I) => Kind<F, S, E1, B>,
  ) => <E2>(self: Kind<F, S, E2, A>) => Kind<F, S, E1 | E2, DoObject<N, A, B>>
}

export const createMonadWithIndex = <F extends Hkt, I>(
  Monad: Monad<F> & ApplicativeWithIndex<F, I>,
): MonadWithIndex<F, I> => {
  const flatMapWithIndex: MonadWithIndex<F, I>["flatMapWithIndex"] =
    aimb => self =>
      pipe (
        Monad.Do,
        Monad.apS ("a", self),
        Monad.mapWithIndex (({ a }, i) => aimb (a, i)),
        Monad.flat,
      )

  const composeWithIndex: MonadWithIndex<F, I>["composeWithIndex"] = (
    bmc,
    amb,
  ) => flow (amb, flatMapWithIndex (bmc))

  const mapToWithIndex: MonadWithIndex<F, I>["mapToWithIndex"] = (name, aib) =>
    flatMapWithIndex ((a, i) =>
      Monad.of ({
        [name]: aib (a, i),
        ...a,
      } as any),
    )

  const flapToWithIndex: MonadWithIndex<F, I>["flapToWithIndex"] =
    (name, faib) => self =>
      pipe (
        Monad.Do,
        Monad.apS ("a", self),
        Monad.apS ("aib", faib),
        Monad.mapWithIndex (
          ({ a, aib }, i) => ({ [name]: aib (a, i), ...a }) as any,
        ),
      )

  const flatMapToWithIndex: MonadWithIndex<F, I>["flatMapToWithIndex"] = (
    name,
    amib,
  ) =>
    flatMapWithIndex ((a, i) =>
      pipe (
        amib (a, i),
        Monad.flatMap (b =>
          Monad.of ({
            [name]: b,
            ...a,
          } as any),
        ),
      ),
    )

  return {
    ...Monad,
    flatMapWithIndex,
    composeWithIndex,
    mapToWithIndex,
    flapToWithIndex,
    flatMapToWithIndex,
  }
}
