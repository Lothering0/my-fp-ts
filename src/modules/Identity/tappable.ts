import { Identity } from "./identity"
import { Sync } from "../Sync"
import { Monad } from "./monad"
import { createTappable } from "../../types/Tappable"

export const Tappable = createTappable (Monad)

export const tap: {
  <A>(f: (a: A) => Identity<unknown>): (self: Identity<A>) => Identity<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: Identity<A>) => Identity<A>
} = Tappable.tapSync
