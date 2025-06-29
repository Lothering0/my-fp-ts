import * as A from "../Array"
import { TreeHKT } from "./tree"
import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"
import { make, valueOf, forestOf } from "./utils"
import { pipe } from "../../utils/flow"

export const monad: Monad<TreeHKT> = createMonad ({
  ...applicative,
  flat: mma =>
    make (
      pipe (mma, valueOf, valueOf),
      A.concat (pipe (mma, valueOf, forestOf), A.map (forestOf (mma), flat)),
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
  tapIo,
} = monad
