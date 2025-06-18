import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"
import { URI, fromIo } from "./io"

export const monad: Monad<URI> = createMonad ({
  ...applicative,
  flat: fromIo,
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
