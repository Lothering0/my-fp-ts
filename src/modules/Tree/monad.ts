import * as A from "../Array"
import { URI } from "./tree"
import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"
import { make, valueOf, forestOf } from "./utils"
import { pipe } from "src/utils/flow"

export const monad: Monad<URI> = createMonad ({
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
