import { _URI } from "./array"
import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"

export const monad: Monad<typeof _URI> = createMonad ({
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
