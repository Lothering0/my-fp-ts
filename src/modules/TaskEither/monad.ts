/* eslint-disable @typescript-eslint/no-explicit-any */
import * as E from "../Either"
import * as T from "../Task"
import * as IoE from "../IoEither"
import { createMonad, Monad } from "../../types/Monad"
import { map } from "./functor"
import { applicative } from "./applicative"
import {
  TaskEitherHKT,
  TaskEither,
  fromTaskEither,
  toTaskEither,
} from "./task-either"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { DoObject } from "src/types/DoObject"

export const monad: Monad<TaskEitherHKT> = createMonad ({
  ...applicative,
  flat:
    <E, A>(mma: TaskEither<E, TaskEither<E, A>>): TaskEither<E, A> =>
    () =>
      fromTaskEither (mma).then (ma =>
        E.isLeft (ma) ? ma : pipe (ma, E.fromRight, fromTaskEither),
      ),
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

export const parallel: {
  <N extends string | number | symbol, E, A, B>(
    fb: TaskEither<E, B>,
  ): (self: TaskEither<E, A>) => TaskEither<E, DoObject<N, A, B>>
  <N extends string | number | symbol, E, A, B>(
    self: TaskEither<E, A>,
    fb: TaskEither<E, B>,
  ): TaskEither<E, DoObject<N, A, B>>
} = overload (
  1,
  (self, fb) => () =>
    Promise.all ([fromTaskEither (self), fromTaskEither (fb)]).then (([ma, mb]) =>
      E.flatMap (mb, () => ma as any),
    ),
)

export const parallelTo: {
  <N extends string | number | symbol, E, A, B>(
    name: Exclude<N, keyof A>,
    fb: TaskEither<E, B>,
  ): (self: TaskEither<E, A>) => TaskEither<E, DoObject<N, A, B>>
  <N extends string | number | symbol, E, A, B>(
    self: TaskEither<E, A>,
    name: Exclude<N, keyof A>,
    fb: TaskEither<E, B>,
  ): TaskEither<E, DoObject<N, A, B>>
} = overload (
  2,
  (self, name, fb) => () =>
    Promise.all ([fromTaskEither (self), fromTaskEither (fb)]).then (([ma, mb]) =>
      E.apS (ma, name, mb),
    ),
)

export const tapEither: {
  <E, A, _>(
    f: (a: A) => E.Either<E, _>,
  ): (self: TaskEither<E, A>) => TaskEither<E, A>
  <E, A, _>(
    self: TaskEither<E, A>,
    f: (a: A) => E.Either<E, _>,
  ): TaskEither<E, A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, T.of)),
    map (({ a }) => a),
  ),
)

export const tapIoEither: {
  <E, A, _>(
    f: (a: A) => IoE.IoEither<E, _>,
  ): (self: TaskEither<E, A>) => TaskEither<E, A>
  <E, A, _>(
    self: TaskEither<E, A>,
    f: (a: A) => IoE.IoEither<E, _>,
  ): TaskEither<E, A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, IoE.fromIoEither, T.of)),
    map (({ a }) => a),
  ),
)

export const tapTask: {
  <_, A, _2>(
    f: (a: A) => T.Task<_2>,
  ): (self: TaskEither<_, A>) => TaskEither<_, A>
  <_, A, _2>(self: TaskEither<_, A>, f: (a: A) => T.Task<_2>): TaskEither<_, A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, toTaskEither)),
    map (({ a }) => a),
  ),
)
