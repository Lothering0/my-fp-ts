import * as A from "../Array"
import * as M from "../../types/Monad"
import { TreeHKT } from "./tree"
import { Applicative } from "./applicative"
import { make, valueOf, forestOf } from "./utils"
import { pipe } from "../../utils/flow"

export const Monad: M.Monad<TreeHKT> = M.createMonad<TreeHKT> ({
  ...Applicative,
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
} = Monad
