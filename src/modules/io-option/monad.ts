/* eslint-disable @typescript-eslint/no-explicit-any */
import * as IO from "../io"
import * as O from "../option"
import { createMonad, Monad } from "../../types/Monad"
import { functor, map } from "./functor"
import { pipe } from "../../utils/pipe"
import { fromIoOption, IOOption } from "./io-option"

export const monad: Monad<"IOOption"> = createMonad (functor) ({
  _URI: "IOOption",
  flat: mma => () =>
    pipe (mma, fromIoOption, ma =>
      O.isNone (ma) ? ma : fromIoOption (O.fromSome (ma)),
    ),
  bind: (mma, f) =>
    pipe (mma, fromIoOption, ma =>
      O.isNone (ma) ? () => ma : f (O.fromSome (ma)),
    ),
  tap:
    <A, B>(mma: IOOption<A>, f: (a: A) => IOOption<B>): IOOption<A> =>
    () =>
      pipe (mma, fromIoOption, ma =>
        O.isNone (ma)
          ? ma
          : pipe (
              O.Do,
              O.apS ("a", ma),
              O.tapIo (({ a }) => f (a)),
              O.map (({ a }) => a),
            ),
      ),
  tapIo:
    <A, B>(mma: IOOption<A>, f: (a: A) => IO.IO<B>): IOOption<A> =>
    () =>
      pipe (mma, fromIoOption, ma =>
        O.isNone (ma)
          ? ma
          : pipe (
              O.Do,
              O.apS ("a", ma),
              O.tapIo (({ a }) => f (a)),
              O.map (({ a }) => a),
            ),
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
