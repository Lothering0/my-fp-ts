import { Identity } from "./identity"
import { Sync } from "../Sync"
import { Monad } from "./monad"
import { create } from "../../typeclasses/Tappable"

export const Tappable = create (Monad)

export const tap: {
  <A>(f: (a: A) => Identity<unknown>): (self: Identity<A>) => Identity<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: Identity<A>) => Identity<A>
} = Tappable.tapSync
