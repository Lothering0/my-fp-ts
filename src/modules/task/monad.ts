import { createMonad, Monad } from "../../types/Monad"
import { fromTask } from "./task"
import { functor, pure, map } from "./functor"
import { pipe } from "../../utils/pipe"

export const monad: Monad<"Task"> = createMonad (functor) ({
  _URI: "Task",
  flat: mma => () => fromTask (mma).then (fromTask),
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
  tapIo: (mma, f) =>
    pipe (
      Do,
      apS ("a", mma),
      bind (({ a }) => bind (pure (f (a)), () => pure (a))),
    ),
  applyTo: (fa, name, ff) => () =>
    fromTask (fa).then (a =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fromTask (ff).then (f => ({ [name]: f (a), ...a }) as any),
    ),
  applyResultTo: (fa, name, fb) => () =>
    Promise.all ([fromTask (fa), fromTask (fb)]).then (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ([a, b]) => ({ [name]: b, ...a }) as any,
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
