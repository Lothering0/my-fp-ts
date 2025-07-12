import { createMonad } from "../../types/Monad"
import { Applicative } from "./applicative"
import { IdentityHKT, identity } from "./identity"

export const Monad = createMonad<IdentityHKT> ({
  ...Applicative,
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
  apS,
  flatMapTo,
  tap,
  tapSync,
} = Monad
