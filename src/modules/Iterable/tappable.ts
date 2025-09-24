import { create } from "../../typeclasses/Tappable"
import { Sync } from "../Sync"
import { Monad } from "./monad"

export const Tappable = create (Monad)

export const tap: {
  <A>(f: (a: A) => Iterable<unknown>): (self: Iterable<A>) => Iterable<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: Iterable<A>) => Iterable<A>
} = Tappable.tapSync
