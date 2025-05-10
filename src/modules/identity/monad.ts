import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"
import { identity } from "./identity"

export const monad: Monad<"Identity"> = createMonad ({
  ...applicative,
  flat: identity,
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
