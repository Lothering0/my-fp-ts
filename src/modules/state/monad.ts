import { flow } from "../../utils/flow"
import { createMonad2, Monad2 } from "../../types/Monad"
import { applicative } from "./applicative"
import { _URI } from "./state"

export const monad: Monad2<typeof _URI> = createMonad2 ({
  ...applicative,
  flat: mma => flow (mma, ([m, s1]) => m (s1)),
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
