import * as async from "./async"
import { create } from "../../typeclasses/Tappable"
import { Sync } from "../Sync"
import { Monad } from "./monad"

export const Tappable = create (Monad)

export const tap: {
  <In>(
    f: (a: In) => async.Async<unknown>,
  ): (self: async.Async<In>) => async.Async<In>
} = Tappable.tap

export const tapSync: {
  <In>(f: (a: In) => Sync<unknown>): (self: async.Async<In>) => async.Async<In>
} = Tappable.tapSync
