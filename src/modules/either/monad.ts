import { createMonad2, Monad2 } from "../../types/Monad"
import { applicative } from "./applicative"
import { fromRight, isLeft } from "./either"

export const monad: Monad2<"Either"> = createMonad2 ({
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
  applyResultTo,
  apS,
  flatMapTo,
  tap,
  tapIo,
} = monad
