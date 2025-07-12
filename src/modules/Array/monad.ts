import { ArrayHKT } from "./array"
import { createMonad } from "../../types/Monad"
import { Applicative } from "./applicative"

export const Monad = createMonad<ArrayHKT> ({
  ...Applicative,
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
} = Monad
