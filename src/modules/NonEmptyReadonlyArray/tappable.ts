import { Sync } from "../Sync"
import { NonEmptyReadonlyArray } from "./non-empty-readonly-array"
import { Monad } from "./monad"
import { create } from "../../typeclasses/Tappable"

export const Tappable = create (Monad)

export const tap: {
  <A>(
    f: (a: A) => NonEmptyReadonlyArray<unknown>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A>
} = Tappable.tap

export const tapSync: {
  <A>(
    f: (a: A) => Sync<unknown>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A>
} = Tappable.tapSync
