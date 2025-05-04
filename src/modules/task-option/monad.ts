/* eslint-disable @typescript-eslint/no-explicit-any */
import * as T from "../task"
import * as TE from "../task-either"
import * as E from "../either"
import * as O from "../option"
import * as I from "../identity"
import { createMonad, Monad } from "../../types/Monad"
import { TaskOption, fromTaskOption, toTaskOptionFromTask } from "./task-option"
import { functor, pure, map } from "./functor"
import { pipe } from "../../utils/pipe"
import { overloadWithPointFree } from "../../utils/points"

export const monad: Monad<"TaskOption"> = createMonad (functor) ({
  _URI: "TaskOption",
  flat: mma => () =>
    fromTaskOption (mma).then (ma =>
      O.isNone (ma) ? ma : fromTaskOption (O.fromSome (ma)),
    ),
  bind: (mma, f) =>
    pipe (
      Do,
      apS ("a", mma),
      map (({ a }) => f (a)),
      flat,
    ),
  tap: (mma, f) =>
    pipe (
      Do,
      apS ("a", mma),
      bind (({ a }) => bind (f (a), () => pure (a))),
    ),
  tapIo: (mma, f) => tap (mma, I.compose (pure, f)),
  applyTo: (fma, name, fmf) => () =>
    fromTaskOption (fma).then (ma =>
      fromTaskOption (fmf).then (mf =>
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
    tap (({ a }) => T.task (f (a))),
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
    tap (({ a }) => pipe (a, f, O.fromEither, T.task)),
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
    tap (({ a }) => toTaskOptionFromTask (f (a))),
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
      TE.taskEither (
        f (a),
        () => O.none,
        () => O.some (a),
      ),
    ),
    map (({ a }) => a),
  )

export const tapTaskEither: TapTaskEither =
  overloadWithPointFree (tapTaskEitherPointed)
