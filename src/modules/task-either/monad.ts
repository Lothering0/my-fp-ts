/* eslint-disable @typescript-eslint/no-explicit-any */
import * as E from "../either"
import * as T from "../task"
import { createMonad2, Monad2 } from "../../types/Monad"
import { functor } from "./functor"
import { TaskEither, fromTaskEither } from "./task-either"
import { pipe } from "../../utils/pipe"
import { overloadWithPointFree } from "../../utils/points"

export const monad: Monad2<"TaskEither"> = createMonad2 (functor) ({
  _URI: "TaskEither",
  flat: mma => () =>
    fromTaskEither (mma).then (ma =>
      E.isLeft (ma) ? ma : fromTaskEither (E.fromRight (ma)),
    ),
  bind: (mma, f) => () =>
    fromTaskEither (mma).then (ma =>
      E.isLeft (ma) ? ma : pipe (ma, E.fromRight, f, fromTaskEither),
    ),
  tap: (mma, f) => () =>
    fromTaskEither (mma).then (ma =>
      E.isLeft (ma)
        ? ma
        : pipe (ma, E.fromRight, f, fromTaskEither).then (ea =>
            E.isLeft (ea) ? ea : ma,
          ),
    ),
  tapIo: (mma, f) => () =>
    fromTaskEither (mma).then (
      ma => (E.isLeft (ma) ? ma : f (E.fromRight (ma)), ma),
    ),
  applyTo: (fma, name, fmf) => () =>
    fromTaskEither (fmf).then (mf =>
      fromTaskEither (fma).then (ma =>
        pipe (
          E.Do,
          E.apS ("f", mf),
          E.apS ("a", ma),
          E.map (({ f, a }) => ({ [name]: f (a), ...a }) as any),
        ),
      ),
    ),
  applyResultTo: (fma, name, fmb) => () =>
    Promise.all ([fromTaskEither (fma), fromTaskEither (fmb)]).then (([ma, mb]) =>
      pipe (
        E.Do,
        E.apS ("a", ma),
        E.apS ("b", mb),
        E.map (({ a, b }) => ({ [name]: b, ...a }) as any),
      ),
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

export const parallel = applyResultTo

interface TapTaskPointed {
  <_, A, _2>(ma: TaskEither<_, A>, f: (a: A) => T.Task<_2>): TaskEither<_, A>
}

interface TapTask extends TapTaskPointed {
  <_, A, _2>(
    f: (a: A) => T.Task<_2>,
  ): (ma: TaskEither<_, A>) => TaskEither<_, A>
}

const tapTaskPointed: TapTaskPointed = (mma, f) => () =>
  fromTaskEither (mma).then (ma =>
    E.isLeft (ma) ? ma : pipe (ma, E.fromRight, f, T.fromTask).then (() => ma),
  )

export const tapTask: TapTask = overloadWithPointFree (tapTaskPointed)
