import { createTappable } from "../../types/Tappable"
import { Sync } from "../Sync"
import { Monad } from "./monad"
import { State } from "./state"

export const Tappable = createTappable (Monad)

export const tap: {
  <S, A>(f: (a: A) => State<S, unknown>): (self: State<S, A>) => State<S, A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): <S>(self: State<S, A>) => State<S, A>
} = Tappable.tapSync
