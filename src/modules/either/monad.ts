import { createMonad2, Monad2 } from "../../types/Monad"
import { fromRight, isLeft } from "./either"
import { functor } from "./functor"

export const monad: Monad2<"Either"> = createMonad2 (functor) ({
  _URI: "Either",
  flat: mma => isLeft (mma) ? mma : fromRight (mma),
})

export const {
  Do,
  flat,
  bind,
  compose,
  mapTo,
  applyTo,
  applyResultTo,
  apS,
  bindTo,
  tap,
  tapIo,
} = monad
