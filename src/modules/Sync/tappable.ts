import { Sync } from "./sync"
import { Monad } from "./monad"
import { create } from "../../typeclasses/Tappable"

export const Tappable = create (Monad)

export const tap: {
  <A>(f: (a: A) => Sync<unknown>): (self: Sync<A>) => Sync<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: Sync<A>) => Sync<A>
} = Tappable.tapSync
