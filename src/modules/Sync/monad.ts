import { createMonad } from "../../types/Monad"
import { applicative } from "./applicative"
import { SyncHKT, fromSync } from "./sync"

export const monad = createMonad<SyncHKT> ({
  ...applicative,
  flat: fromSync,
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
