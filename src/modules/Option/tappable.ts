import * as option from "./option"
import * as result from "../Result"
import { Sync } from "../Sync"
import { Monad, flatMap } from "./monad"
import { map } from "./functor"
import { zero } from "./alternative"
import { pipe } from "../../utils/flow"
import { constant } from "../../utils/constant"
import { createTappable } from "../../typeclasses/Tappable"

export const Tappable = createTappable (Monad)

export const tap: {
  <A>(
    f: (a: A) => option.Option<unknown>,
  ): (self: option.Option<A>) => option.Option<A>
} = Tappable.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: option.Option<A>) => option.Option<A>
} = Tappable.tapSync

export const tapResult: {
  <E, A>(
    afe: (a: A) => result.Result<E, unknown>,
  ): (self: option.Option<A>) => option.Option<A>
} = afe => self =>
  pipe (self, map (afe), flatMap (result.match (zero, constant (self))))
