import { Sync } from "./sync"
import { Monad } from "./monad"
import { createTappable } from "../../types/Tappable"

export const Tappable = createTappable (Monad)

export const tap: {
  <A>(f: (a: A) => Sync<unknown>): (self: Sync<A>) => Sync<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: Sync<A>) => Sync<A>
} = Tappable.tapSync
