import { createTappable } from "../../types/Tappable"
import { Sync } from "../Sync"
import { Monad } from "./monad"
import { Result } from "./result"

export const Tappable = createTappable (Monad)

export const tap: {
  <E1, A>(
    f: (a: A) => Result<E1, unknown>,
  ): <E2>(self: Result<E2, A>) => Result<E1 | E2, A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): <E>(self: Result<E, A>) => Result<E, A>
} = Tappable.tapSync
