import { Applicative } from "./applicative"
import { failure, ResultHKT } from "./result"
import { match } from "./utils"
import { createMonad } from "../../types/Monad"
import { identity } from "../Identity"

export const Monad = createMonad<ResultHKT> ({
  ...Applicative,
  flat: match (failure, identity),
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
