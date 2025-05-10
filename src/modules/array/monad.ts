import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"

const monad: Monad<"Array"> = createMonad ({
  ...applicative,
  flat: xs => xs.flat (),
})

export const {
  Do,
  flat,
  flatMap,
  compose,
  setTo,
  mapTo,
  applyTo,
  applyResultTo,
  apS,
  flatMapTo,
  tap,
  tapIo,
} = monad
