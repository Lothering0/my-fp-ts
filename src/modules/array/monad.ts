import { createMonad, Monad } from "../../types/Monad"
import { functor } from "./functor"

const monad: Monad<"Array"> = createMonad (functor) ({
  _URI: "Array",
  flat: xs => xs.flat (),
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
