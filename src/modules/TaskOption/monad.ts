/* eslint-disable @typescript-eslint/no-explicit-any */
import * as T from "../Task"
import * as TE from "../TaskEither"
import * as E from "../Either"
import * as O from "../Option"
import * as IoO from "../IoOption"
import * as IoE from "../IoEither"
import { createMonad, DoObject, Monad } from "../../types/Monad"
import {
  _URI,
  TaskOption,
  fromTaskOption,
  toTaskOptionFromTask,
} from "./task-option"
import { map } from "./functor"
import { applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { overload, overload2 } from "../../utils/overloads"

export const monad: Monad<typeof _URI> = createMonad ({
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

interface ParallelPointed {
  <N extends string | number | symbol, A, B>(
    fa: TaskOption<A>,
    fb: TaskOption<B>,
  ): TaskOption<DoObject<N, A, B>>
}

interface Parallel extends ParallelPointed {
  <N extends string | number | symbol, A, B>(
    fb: TaskOption<B>,
  ): (fa: TaskOption<A>) => TaskOption<DoObject<N, A, B>>
}

const parallelPointed: ParallelPointed = (fa, fb) => () =>
  Promise.all ([fromTaskOption (fa), fromTaskOption (fb)]).then (([ma, mb]) =>
    O.flatMap (mb, () => ma as any),
  )

export const parallel: Parallel = overload (parallelPointed)

interface ParallelToPointed {
  <N extends string | number | symbol, A, B>(
    fa: TaskOption<A>,
    name: Exclude<N, keyof A>,
    fb: TaskOption<B>,
  ): TaskOption<DoObject<N, A, B>>
}

interface ParallelTo extends ParallelToPointed {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: TaskOption<B>,
  ): (fa: TaskOption<A>) => TaskOption<DoObject<N, A, B>>
}

const parallelToPointed: ParallelToPointed = (fa, name, fb) => () =>
  Promise.all ([fromTaskOption (fa), fromTaskOption (fb)]).then (([ma, mb]) =>
    O.apS (ma, name, mb),
  )

export const parallelTo: ParallelTo = overload2 (parallelToPointed)

interface TapOptionPointed {
  <A, _>(ma: TaskOption<A>, f: (a: A) => O.Option<_>): TaskOption<A>
}

interface TapOption extends TapOptionPointed {
  <A, _>(f: (a: A) => O.Option<_>): (ma: TaskOption<A>) => TaskOption<A>
}

const tapOptionPointed: TapOptionPointed = (mma, f) =>
  pipe (
    Do,
    apS ("a", mma),
    tap (({ a }) => pipe (a, f, T.of)),
    map (({ a }) => a),
  )

export const tapOption: TapOption = overload (tapOptionPointed)

interface TapEitherPointed {
  <E, A, _>(ma: TaskOption<A>, f: (a: A) => E.Either<E, _>): TaskOption<A>
}

interface TapEither extends TapEitherPointed {
  <E, A, _>(f: (a: A) => E.Either<E, _>): (ma: TaskOption<A>) => TaskOption<A>
}

const tapEitherPointed: TapEitherPointed = (mma, f) =>
  pipe (
    Do,
    apS ("a", mma),
    tap (({ a }) => pipe (a, f, O.fromEither, T.of)),
    map (({ a }) => a),
  )

export const tapEither: TapEither = overload (tapEitherPointed)

interface TapTaskPointed {
  <A, _>(ma: TaskOption<A>, f: (a: A) => T.Task<_>): TaskOption<A>
}

interface TapTask extends TapTaskPointed {
  <A, _>(f: (a: A) => T.Task<_>): (ma: TaskOption<A>) => TaskOption<A>
}

const tapTaskPointed: TapTaskPointed = (mma, f) =>
  pipe (
    Do,
    apS ("a", mma),
    tap (({ a }) => pipe (a, f, toTaskOptionFromTask)),
    map (({ a }) => a),
  )

export const tapTask: TapTask = overload (tapTaskPointed)

interface TapTaskEitherPointed {
  <E, A, _>(ma: TaskOption<A>, f: (a: A) => TE.TaskEither<E, _>): TaskOption<A>
}

interface TapTaskEither extends TapTaskEitherPointed {
  <E, A, _>(
    f: (a: A) => TE.TaskEither<E, _>,
  ): (ma: TaskOption<A>) => TaskOption<A>
}

const tapTaskEitherPointed: TapTaskEitherPointed = (mma, f) =>
  pipe (
    Do,
    apS ("a", mma),
    tap (({ a }) =>
      pipe (
        a,
        f,
        TE.taskEither (
          () => O.none,
          () => O.some (a),
        ),
      ),
    ),
    map (({ a }) => a),
  )

export const tapTaskEither: TapTaskEither = overload (tapTaskEitherPointed)

interface TapIoOptionPointed {
  <A, _>(ma: TaskOption<A>, f: (a: A) => IoO.IoOption<_>): TaskOption<A>
}

interface TapIoOption extends TapIoOptionPointed {
  <A, _>(f: (a: A) => IoO.IoOption<_>): (ma: TaskOption<A>) => TaskOption<A>
}

const tapIoOptionPointed: TapIoOptionPointed = (mma, f) =>
  pipe (
    Do,
    apS ("a", mma),
    tapOption (({ a }) => pipe (a, f, IoO.fromIoOption)),
    map (({ a }) => a),
  )

export const tapIoOption: TapIoOption = overload (tapIoOptionPointed)

interface TapIoEitherPointed {
  <E, A, _>(ma: TaskOption<A>, f: (a: A) => IoE.IoEither<E, _>): TaskOption<A>
}

interface TapIoEither extends TapIoEitherPointed {
  <E, A, _>(
    f: (a: A) => IoE.IoEither<E, _>,
  ): (ma: TaskOption<A>) => TaskOption<A>
}

const tapIoEitherPointed: TapIoEitherPointed = (mma, f) =>
  pipe (
    Do,
    apS ("a", mma),
    tapEither (({ a }) => pipe (a, f, IoE.fromIoEither)),
    map (({ a }) => a),
  )

export const tapIoEither: TapIoEither = overload (tapIoEitherPointed)
