import { createTappable } from "../../types/Tappable"
import { Sync } from "../Sync"
import { Monad } from "./monad"

export const Tappable = createTappable (Monad)

export const tap: {
  <A>(
    f: (a: A) => ReadonlyArray<unknown>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = Tappable.tapSync
