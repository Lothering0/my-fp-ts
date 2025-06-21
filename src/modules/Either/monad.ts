import { createMonad2, Monad2 } from "../../types/Monad"
import { applicative } from "./applicative"
import { URI } from "./either"
import { isLeft, fromRight } from "./utils"

export const monad: Monad2<URI> = createMonad2 ({
  ...applicative,
  flat: mma => isLeft (mma) ? mma : fromRight (mma),
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
