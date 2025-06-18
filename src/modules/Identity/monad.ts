import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"
import { URI, identity } from "./identity"

export const monad: Monad<URI> = createMonad ({
  ...applicative,
  flat: identity,
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
