import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"

const monad: Monad<"Array"> = createMonad ({
  ...applicative,
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
