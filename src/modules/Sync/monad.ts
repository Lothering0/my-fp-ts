import { createMonad } from "../../types/Monad"
import { Applicative } from "./applicative"
import { SyncHKT, execute } from "./sync"

export const Monad = createMonad<SyncHKT> ({
  ...Applicative,
  flat: execute,
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
