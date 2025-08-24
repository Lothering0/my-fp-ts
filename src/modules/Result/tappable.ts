import * as tappableBoth from "../../types/TappableBoth"
import { createTappable } from "../../types/Tappable"
import { Sync } from "../Sync"
import { Monad } from "./monad"
import { fail, Result, ResultHkt, succeed } from "./result"
import { pipe } from "../../utils/flow"
import { match } from "./utils"

export const Tappable = createTappable (Monad)

export const TappableBoth: tappableBoth.TappableBoth<ResultHkt> = {
  ...Tappable,
  tapLeft: f =>
    match (
      e =>
        pipe (
          e,
          f,
          match (fail, () => fail (e)),
        ),
      succeed,
    ),
  tapLeftSync: f =>
    match (
      e =>
        pipe (
          e,
          f,
          sync => sync (), // From `Sync`
          () => fail (e),
        ),
      succeed,
    ),
}

export const tap: {
  <E1, A>(
    f: (a: A) => Result<E1, unknown>,
  ): <E2>(self: Result<E2, A>) => Result<E1 | E2, A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): <E>(self: Result<E, A>) => Result<E, A>
} = Tappable.tapSync

export const tapLeft: {
  <E1, E2>(
    f: (e: E1) => Result<E2, unknown>,
  ): <A>(self: Result<E1, A>) => Result<E1 | E2, A>
} = TappableBoth.tapLeft

export const tapLeftSync: {
  <E>(f: (e: E) => Sync<unknown>): <A>(self: Result<E, A>) => Result<E, A>
} = TappableBoth.tapLeftSync
