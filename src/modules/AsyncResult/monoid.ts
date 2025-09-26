import { Monoid } from "../../typeclasses/Monoid"
import { getRaceSemigroup } from "./semigroup"
import { AsyncResult } from "./async-result"
import { succeed } from "../Result"
import { _ } from "../../utils/underscore"

export const empty: AsyncResult<never, never> = () =>
  new Promise (() => succeed (_))

export const getRaceMonoid: {
  <Failure, Out>(): Monoid<AsyncResult<Failure, Out>>
} = () => ({
  ...getRaceSemigroup (),
  empty,
})
