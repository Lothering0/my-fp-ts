import { flow } from "../../utils/flow"
import { createMonad, Monad } from "../../types/Monad"
import { applicative } from "./applicative"
import { StateHKT } from "./state"

export const monad: Monad<StateHKT> = createMonad ({
  ...applicative,
  flat: mma => flow (mma, ([ma, s1]) => ma (s1)),
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
