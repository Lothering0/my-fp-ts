import { flow } from "../../utils/flow"
import { createMonad } from "../../types/Monad"
import { Applicative } from "./applicative"
import { StateHKT } from "./state"

export const Monad = createMonad<StateHKT> ({
  ...Applicative,
  flat: self => flow (self, ([ma, s1]) => ma (s1)),
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
