import { createMonad, Monad } from "../../types/Monad"
import { functor } from "./functor"
import { identity } from "./identity"

export const monad: Monad<"Identity"> = createMonad (functor) ({
  _URI: "Identity",
  flat: identity,
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
