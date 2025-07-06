import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"
import { EitherHKT } from "./either"
import { isLeft, fromRight } from "./utils"

export const monad: Monad<EitherHKT> = createMonad ({
  ...applicative,
  flat: self => isLeft (self) ? self : fromRight (self),
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
