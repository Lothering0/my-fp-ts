/* eslint-disable @typescript-eslint/no-explicit-any */
import * as T from "../task"
import * as TE from "../task-either"
import * as E from "../either"
import * as O from "../option"
import * as IOO from "../io-option"
import * as IOE from "../io-either"
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
import {
  overloadWithPointFree,
  overloadWithPointFree2,
} from "../../utils/points"

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
  applyResultTo,
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

export const parallel: Parallel = overloadWithPointFree (parallelPointed)

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

export const parallelTo: ParallelTo = overloadWithPointFree2 (parallelToPointed)

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

export const tapOption: TapOption = overloadWithPointFree (tapOptionPointed)

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

export const tapEither: TapEither = overloadWithPointFree (tapEitherPointed)

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

export const tapTask: TapTask = overloadWithPointFree (tapTaskPointed)

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

export const tapTaskEither: TapTaskEither =
  overloadWithPointFree (tapTaskEitherPointed)

interface TapIOOptionPointed {
  <A, _>(ma: TaskOption<A>, f: (a: A) => IOO.IOOption<_>): TaskOption<A>
}

interface TapIOOption extends TapIOOptionPointed {
  <A, _>(f: (a: A) => IOO.IOOption<_>): (ma: TaskOption<A>) => TaskOption<A>
}

const tapIoOptionPointed: TapIOOptionPointed = (mma, f) =>
  pipe (
    Do,
    apS ("a", mma),
    tapOption (({ a }) => pipe (a, f, IOO.fromIoOption)),
    map (({ a }) => a),
  )

export const tapIoOption: TapIOOption =
  overloadWithPointFree (tapIoOptionPointed)

interface TapIOEitherPointed {
  <E, A, _>(ma: TaskOption<A>, f: (a: A) => IOE.IOEither<E, _>): TaskOption<A>
}

interface TapIOEither extends TapIOEitherPointed {
  <E, A, _>(
    f: (a: A) => IOE.IOEither<E, _>,
  ): (ma: TaskOption<A>) => TaskOption<A>
}

const tapIoEitherPointed: TapIOEitherPointed = (mma, f) =>
  pipe (
    Do,
    apS ("a", mma),
    tapEither (({ a }) => pipe (a, f, IOE.fromIoEither)),
    map (({ a }) => a),
  )

export const tapIoEither: TapIOEither =
  overloadWithPointFree (tapIoEitherPointed)
