import { ArrayHKT } from "./array"
import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"

export const monad: Monad<ArrayHKT> = createMonad ({
  ...applicative,
  flat: self => self.flat (),
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
