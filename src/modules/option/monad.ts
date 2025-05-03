import { createMonad, Monad } from "../../types/Monad"
import { option, none } from "./option"
import { functor } from "./functor"
import { identity } from "../identity"

export const monad: Monad<"Option"> = createMonad (functor) ({
  _URI: "Option",
  flat: option (() => none, identity),
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
