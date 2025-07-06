import { ArrayHKT } from "./array"
import { createMonad } from "../../types/Monad"
import { applicative } from "./applicative"

export const monad = createMonad<ArrayHKT> ({
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
  tapSync,
} = monad
