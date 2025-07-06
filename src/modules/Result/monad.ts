import { createMonad } from "../../types/Monad"
import { applicative } from "./applicative"
import { ResultHKT } from "./result"
import { isFailure, fromSuccess } from "./utils"

export const monad = createMonad<ResultHKT> ({
  ...applicative,
  flat: self => isFailure (self) ? self : fromSuccess (self),
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
