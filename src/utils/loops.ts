import * as option from "../modules/Option"
import * as predicate from "../modules/Predicate"
import { pipe } from "./flow"

export const doWhile =
  <Out>(ab: (a: option.Option<Out>) => Out) =>
  (p: (a: option.Option<Out>) => boolean): option.Option<Out> => {
    let out: option.Option<Out> = option.none
    do out = option.some (ab (out))
    while (p (out))
    return out
  }

export const doUntil: {
  <Out>(
    ab: (a: option.Option<Out>) => Out,
  ): (p: (a: option.Option<Out>) => boolean) => option.Option<Out>
} = ab => p => doWhile (ab) (pipe (p, predicate.not))
