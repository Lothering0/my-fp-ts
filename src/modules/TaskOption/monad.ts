/* eslint-disable @typescript-eslint/no-explicit-any */
import * as T from "../Task"
import * as TE from "../TaskEither"
import * as E from "../Either"
import * as O from "../Option"
import * as IoO from "../IoOption"
import * as IoE from "../IoEither"
import { createMonad, Monad } from "../../types/Monad"
import {
  TaskOptionHKT,
  TaskOption,
  fromTaskOption,
  toTaskOptionFromTask,
} from "./task-option"
import { map } from "./functor"
import { applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { DoObject } from "../../types/DoObject"

export const monad: Monad<TaskOptionHKT> = createMonad ({
  ...applicative,
  flat:
    <A>(mma: TaskOption<TaskOption<A>>): TaskOption<A> =>
    () =>
      fromTaskOption (mma).then (ma =>
        O.isNone (ma) ? ma : pipe (ma, O.fromSome, fromTaskOption),
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
  <N extends string | number | symbol, A, B>(
    fb: TaskOption<B>,
  ): (fa: TaskOption<A>) => TaskOption<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    fa: TaskOption<A>,
    fb: TaskOption<B>,
  ): TaskOption<DoObject<N, A, B>>
} = overload (
  1,
  (fa, fb) => () =>
    Promise.all ([fromTaskOption (fa), fromTaskOption (fb)]).then (([ma, mb]) =>
      O.flatMap (mb, () => ma as any),
    ),
)

export const parallelTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: TaskOption<B>,
  ): (fa: TaskOption<A>) => TaskOption<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    fa: TaskOption<A>,
    name: Exclude<N, keyof A>,
    fb: TaskOption<B>,
  ): TaskOption<DoObject<N, A, B>>
} = overload (
  2,
  (fa, name, fb) => () =>
    Promise.all ([fromTaskOption (fa), fromTaskOption (fb)]).then (([ma, mb]) =>
      O.apS (ma, name, mb),
    ),
)

export const tapOption: {
  <A, _>(f: (a: A) => O.Option<_>): (self: TaskOption<A>) => TaskOption<A>
  <A, _>(self: TaskOption<A>, f: (a: A) => O.Option<_>): TaskOption<A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, T.of)),
    map (({ a }) => a),
  ),
)

export const tapEither: {
  <E, A, _>(f: (a: A) => E.Either<E, _>): (self: TaskOption<A>) => TaskOption<A>
  <E, A, _>(self: TaskOption<A>, f: (a: A) => E.Either<E, _>): TaskOption<A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, O.fromEither, T.of)),
    map (({ a }) => a),
  ),
)

export const tapTask: {
  <A, _>(f: (a: A) => T.Task<_>): (self: TaskOption<A>) => TaskOption<A>
  <A, _>(self: TaskOption<A>, f: (a: A) => T.Task<_>): TaskOption<A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tap (({ a }) => pipe (a, f, toTaskOptionFromTask)),
    map (({ a }) => a),
  ),
)

export const tapTaskEither: {
  <E, A, _>(
    f: (a: A) => TE.TaskEither<E, _>,
  ): (ma: TaskOption<A>) => TaskOption<A>
  <E, A, _>(ma: TaskOption<A>, f: (a: A) => TE.TaskEither<E, _>): TaskOption<A>
} = overload (1, (mma, f) =>
  pipe (
    Do,
    apS ("a", mma),
    tap (({ a }) =>
      pipe (
        a,
        f,
        TE.match (
          () => O.none,
          () => O.some (a),
        ),
      ),
    ),
    map (({ a }) => a),
  ),
)

export const tapIoOption: {
  <A, _>(f: (a: A) => IoO.IoOption<_>): (self: TaskOption<A>) => TaskOption<A>
  <A, _>(self: TaskOption<A>, f: (a: A) => IoO.IoOption<_>): TaskOption<A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tapOption (({ a }) => pipe (a, f, IoO.fromIoOption)),
    map (({ a }) => a),
  ),
)

export const tapIoEither: {
  <E, A, _>(
    f: (a: A) => IoE.IoEither<E, _>,
  ): (self: TaskOption<A>) => TaskOption<A>
  <E, A, _>(self: TaskOption<A>, f: (a: A) => IoE.IoEither<E, _>): TaskOption<A>
} = overload (1, (self, f) =>
  pipe (
    Do,
    apS ("a", self),
    tapEither (({ a }) => pipe (a, f, IoE.fromIoEither)),
    map (({ a }) => a),
  ),
)
