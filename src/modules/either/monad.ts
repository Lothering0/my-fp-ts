import { createMonad2, Monad2 } from "../../types/Monad"
import { applicative } from "./applicative"
import { _URI, fromRight, isLeft } from "./either"

export const monad: Monad2<typeof _URI> = createMonad2 ({
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
