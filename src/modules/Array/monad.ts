import { URI } from "./array"
import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"

export const monad: Monad<URI> = createMonad ({
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
  apS,
  flatMapTo,
  tap,
  tapIo,
} = monad
