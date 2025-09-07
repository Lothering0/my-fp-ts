import * as option from "../Option"
import * as result from "../Result"
import * as separated from "../Separated"
import * as compactable from "../../typeclasses/Compactable"
import { ReadonlyArrayHkt } from "./readonly-array"
import { of } from "./applicative"
import { flatMap } from "./monad"
import { reduce } from "./foldable"
import { successes, append, fromNonEmpty } from "./utils"
import { constEmptyArray } from "../../utils/constant"
import { pipe } from "../../utils/flow"

const getInitialSeparated: {
  <E, A>(): separated.Separated<ReadonlyArray<E>, ReadonlyArray<A>>
} = () => separated.make ([], [])

export const Compactable: compactable.Compactable<ReadonlyArrayHkt> = {
  compact: flatMap (
    option.match ({
      onNone: constEmptyArray,
      onSome: of,
    }),
  ),
  compactResults: successes,
  separate: reduce (getInitialSeparated (), (b, ma) =>
    pipe (
      ma,
      result.match ({
        onFailure: e =>
          separated.make (
            pipe (b, separated.left, append (e)),
            separated.right (b),
          ),
        onSuccess: a =>
          separated.make (
            separated.left (b),
            pipe (b, separated.right, append (a), fromNonEmpty),
          ),
      }),
    ),
  ),
}

export const compact: {
  <A>(self: ReadonlyArray<option.Option<A>>): ReadonlyArray<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: ReadonlyArray<result.Result<unknown, A>>): ReadonlyArray<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(
    self: ReadonlyArray<result.Result<E, A>>,
  ): separated.Separated<ReadonlyArray<E>, ReadonlyArray<A>>
} = Compactable.separate
