import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"
import { fromIo } from "./io"

export const monad: Monad<"IO"> = createMonad ({
  ...applicative,
  flat: fromIo,
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
