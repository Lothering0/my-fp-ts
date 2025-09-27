import * as Option from '../modules/Option'
import * as Predicate from '../modules/Predicate'
import { pipe } from './flow'

export const doWhile =
  <Out>(ab: (a: Option.Option<Out>) => Out) =>
  (p: (a: Option.Option<Out>) => boolean): Option.Option<Out> => {
    let out: Option.Option<Out> = Option.none
    do out = Option.some(ab(out))
    while (p(out))
    return out
  }

export const doUntil: {
  <Out>(
    ab: (a: Option.Option<Out>) => Out,
  ): (p: (a: Option.Option<Out>) => boolean) => Option.Option<Out>
} = ab => p => doWhile(ab)(pipe(p, Predicate.not))
