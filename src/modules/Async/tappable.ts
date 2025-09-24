import * as async from "./async"
import { create } from "../../typeclasses/Tappable"
import { Sync } from "../Sync"
import { Monad } from "./monad"

export const Tappable = create (Monad)

export const tap: {
  <A>(
    f: (a: A) => async.Async<unknown>,
  ): (self: async.Async<A>) => async.Async<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: async.Async<A>) => async.Async<A>
} = Tappable.tapSync
