/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMonad, Monad } from "../../types/Monad"
import { functor, map, pure } from "./functor"
import { fromIo } from "./io"
import { pipe } from "../../utils/pipe"

export const monad: Monad<"IO"> = createMonad (functor) ({
  _URI: "IO",
  flat: fromIo,
  bind: (ma, f) => pipe (ma, fromIo, f),
  tap: (ma, f) =>
    pipe (
      Do,
      apS ("a", ma),
      bind (({ a }) => bind (f (a), () => pure (a))),
    ),
  tapIo: (ma, f) =>
    pipe (
      Do,
      apS ("a", ma),
      bind (({ a }) => bind (pure (f (a)), () => pure (a))),
    ),
  applyTo: (fa, name, ff) =>
    pipe (
      Do,
      apS ("a", fa),
      apS ("f", ff),
      map (({ a, f }) => ({ [name]: f (a), ...a }) as any),
    ),
  applyResultTo: (fa, name, fb) =>
    pipe (
      Do,
      bindTo ("a", () => fa),
      bindTo ("b", () => fb),
      map (({ a, b }) => ({ [name]: b, ...a }) as any),
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
