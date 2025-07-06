import * as A from "../Array"
import { TreeHKT } from "./tree"
import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"
import { make, valueOf, forestOf } from "./utils"
import { pipe } from "../../utils/flow"

export const monad: Monad<TreeHKT> = createMonad<TreeHKT> ({
  ...applicative,
  flat: self =>
    make (
      pipe (self, valueOf, valueOf),
      A.concat (pipe (self, valueOf, forestOf), A.map (forestOf (self), flat)),
    ),
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
