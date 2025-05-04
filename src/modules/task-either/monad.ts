/* eslint-disable @typescript-eslint/no-explicit-any */
import * as E from "../either"
import * as T from "../task"
import { createMonad2, DoObject, Monad2 } from "../../types/Monad"
import { functor, map } from "./functor"
import { TaskEither, fromTaskEither, toTaskEither } from "./task-either"
import { pipe } from "../../utils/pipe"
import {
  overloadWithPointFree,
  overloadWithPointFree2,
} from "../../utils/points"

export const monad: Monad2<"TaskEither"> = createMonad2 (functor) ({
  _URI: "TaskEither",
  flat: mma => () =>
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
