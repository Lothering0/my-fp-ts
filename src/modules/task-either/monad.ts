/* eslint-disable @typescript-eslint/no-explicit-any */
import * as E from "../either"
import * as T from "../task"
import * as IOE from "../io-either"
import { createMonad2, DoObject, Monad2 } from "../../types/Monad"
import { map } from "./functor"
import { applicative } from "./applicative"
import { TaskEither, fromTaskEither, toTaskEither } from "./task-either"
import { pipe } from "../../utils/pipe"
import {
  overloadWithPointFree,
  overloadWithPointFree2,
} from "../../utils/points"

export const monad: Monad2<"TaskEither"> = createMonad2 ({
  ...applicative,
  flat:
    <E, A>(mma: TaskEither<E, TaskEither<E, A>>): TaskEither<E, A> =>
    () =>
      fromTaskEither (mma).then (ma =>
        E.isLeft (ma) ? ma : fromTaskEither (E.fromRight (ma)),
      ),
})

export const {
  Do,
  flat,
  bind,
  compose,
  mapTo,
  applyTo,
  applyResultTo,
  apS,
  bindTo,
  tap,
  tapIo,
} = monad

interface ParallelPointed {
  <N extends string | number | symbol, E, A, B>(
    fa: TaskEither<E, A>,
    fb: TaskEither<E, B>,
  ): TaskEither<E, DoObject<N, A, B>>
}

interface Parallel extends ParallelPointed {
  <N extends string | number | symbol, E, A, B>(
    fb: TaskEither<E, B>,
  ): (fa: TaskEither<E, A>) => TaskEither<E, DoObject<N, A, B>>
}

const parallelPointed: ParallelPointed = (fa, fb) => () =>
  Promise.all ([fromTaskEither (fa), fromTaskEither (fb)]).then (([ma, mb]) =>
    E.bind (mb, () => ma as any),
  )

export const parallel: Parallel = overloadWithPointFree (parallelPointed)

interface ParallelToPointed {
  <N extends string | number | symbol, E, A, B>(
    fa: TaskEither<E, A>,
    name: Exclude<N, keyof A>,
    fb: TaskEither<E, B>,
  ): TaskEither<E, DoObject<N, A, B>>
}

interface ParallelTo extends ParallelToPointed {
  <N extends string | number | symbol, E, A, B>(
    name: Exclude<N, keyof A>,
    fb: TaskEither<E, B>,
  ): (fa: TaskEither<E, A>) => TaskEither<E, DoObject<N, A, B>>
}

const parallelToPointed: ParallelToPointed = (fa, name, fb) => () =>
  Promise.all ([fromTaskEither (fa), fromTaskEither (fb)]).then (([ma, mb]) =>
    E.apS (ma, name, mb),
  )

export const parallelTo: ParallelTo = overloadWithPointFree2 (parallelToPointed)

interface TapEitherPointed {
  <E, A, _>(ma: TaskEither<E, A>, f: (a: A) => E.Either<E, _>): TaskEither<E, A>
}

interface TapEither extends TapEitherPointed {
  <E, A, _>(
    f: (a: A) => E.Either<E, _>,
  ): (ma: TaskEither<E, A>) => TaskEither<E, A>
}

const tapEitherPointed: TapEitherPointed = (ma, f) =>
  pipe (
    Do,
    apS ("a", ma),
    tap (({ a }) => T.of (f (a))),
    map (({ a }) => a),
  )

export const tapEither: TapEither = overloadWithPointFree (tapEitherPointed)

interface TapIOEitherPointed {
  <E, A, _>(
    ma: TaskEither<E, A>,
    f: (a: A) => IOE.IOEither<E, _>,
  ): TaskEither<E, A>
}

interface TapIOEither extends TapIOEitherPointed {
  <E, A, _>(
    f: (a: A) => IOE.IOEither<E, _>,
  ): (ma: TaskEither<E, A>) => TaskEither<E, A>
}

const tapIoEitherPointed: TapIOEitherPointed = (ma, f) =>
  pipe (
    Do,
    apS ("a", ma),
    tap (({ a }) => T.of (IOE.fromIoEither (f (a)))),
    map (({ a }) => a),
  )

export const tapIoEither: TapIOEither =
  overloadWithPointFree (tapIoEitherPointed)

interface TapTaskPointed {
  <_, A, _2>(ma: TaskEither<_, A>, f: (a: A) => T.Task<_2>): TaskEither<_, A>
}

interface TapTask extends TapTaskPointed {
  <_, A, _2>(
    f: (a: A) => T.Task<_2>,
  ): (ma: TaskEither<_, A>) => TaskEither<_, A>
}

const tapTaskPointed: TapTaskPointed = (mma, f) =>
  pipe (
    Do,
    apS ("a", mma),
    tap (({ a }) => toTaskEither (f (a))),
    map (({ a }) => a),
  )

export const tapTask: TapTask = overloadWithPointFree (tapTaskPointed)
