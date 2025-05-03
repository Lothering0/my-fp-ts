/* eslint-disable @typescript-eslint/no-explicit-any */
import * as T from "../task"
import * as TE from "../task-either"
import * as E from "../either"
import * as O from "../option"
import { createMonad, Monad } from "../../types/Monad"
import { TaskOption, fromTaskOption } from "./task-option"
import { functor } from "./functor"
import { pipe } from "../../utils/pipe"
import { overloadWithPointFree } from "../../utils/points"

export const monad: Monad<"TaskOption"> = createMonad (functor) ({
  _URI: "TaskOption",
  flat: mma => () =>
    fromTaskOption (mma).then (ma =>
      O.isNone (ma) ? ma : fromTaskOption (O.fromSome (ma)),
    ),
  bind: (mma, f) => () =>
    fromTaskOption (mma).then (ma =>
      O.isNone (ma) ? ma : pipe (ma, O.fromSome, f, fromTaskOption),
    ),
  tap: (mma, f) => () =>
    fromTaskOption (mma).then (ma =>
      O.isNone (ma)
        ? ma
        : pipe (ma, O.fromSome, f, fromTaskOption).then (oa =>
            O.isNone (oa) ? O.none : ma,
          ),
    ),
  tapIo: (mma, f) => () =>
    fromTaskOption (mma).then (ma => (O.isNone (ma) ? ma : f (O.fromSome (ma)), ma)),
  applyTo: (fma, name, fmf) => () =>
    fromTaskOption (fmf).then (mf =>
      fromTaskOption (fma).then (ma =>
        pipe (
          O.Do,
          O.apS ("f", mf),
          O.apS ("a", ma),
          O.map (({ f, a }) => ({ [name]: f (a), ...a }) as any),
        ),
      ),
    ),
  applyResultTo: (fma, name, fmb) => () =>
    Promise.all ([fromTaskOption (fma), fromTaskOption (fmb)]).then (([ma, mb]) =>
      pipe (
        O.Do,
        O.apS ("a", ma),
        O.apS ("b", mb),
        O.map (({ a, b }) => ({ [name]: b, ...a }) as any),
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
  <A, _>(ma: TaskOption<A>, f: (a: A) => T.Task<_>): TaskOption<A>
}

interface TapTask extends TapTaskPointed {
  <A, _>(f: (a: A) => T.Task<_>): (ma: TaskOption<A>) => TaskOption<A>
}

const tapTaskPointed: TapTaskPointed = (mma, f) => () =>
  fromTaskOption (mma).then (ma =>
    O.isNone (ma) ? ma : pipe (ma, O.fromSome, f, T.fromTask).then (() => ma),
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

const tapTaskEitherPointed: TapTaskEitherPointed = (mma, f) => () =>
  fromTaskOption (mma).then (ma =>
    O.isNone (ma)
      ? ma
      : pipe (ma, O.fromSome, f, T.fromTask).then (ea =>
          E.isLeft (ea) ? O.none : ma,
        ),
  )

export const tapTaskEither: TapTaskEither =
  overloadWithPointFree (tapTaskEitherPointed)
