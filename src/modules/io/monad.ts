import { createMonad, Monad } from "../../types/Monad"
import { functor } from "./functor"
import { fromIo } from "./io"

export const monad: Monad<"IO"> = createMonad (functor) ({
  _URI: "IO",
  flat: fromIo,
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
