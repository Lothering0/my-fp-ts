import { createMonad } from "../../types/Monad"
import { applicative } from "./applicative"
import { IdentityHKT, identity } from "./identity"

export const monad = createMonad<IdentityHKT> ({
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
  apS,
  flatMapTo,
  tap,
  tapSync,
} = monad
