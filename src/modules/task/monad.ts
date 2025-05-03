import { createMonad, Monad } from "../../types/Monad"
import { fromTask } from "./task"
import { functor } from "./functor"
import * as I from "../identity"

export const monad: Monad<"Task"> = createMonad (functor) ({
  _URI: "Task",
  flat: mma => () => fromTask (mma).then (fromTask),
  bind: (ma, f) => () => fromTask (ma).then (I.compose (fromTask, f)),
  tap: (ma, f) => () => fromTask (ma).then (a => fromTask (f (a)).then (() => a)),
  tapIo: (ma, f) => () => fromTask (ma).then (a => (f (a), a)),
  applyTo: (fa, name, ff) => () =>
    fromTask (ff).then (f =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fromTask (fa).then (a => ({ [name]: f (a), ...a }) as any),
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
