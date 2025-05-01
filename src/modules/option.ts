import * as I from "./identity"
import { Functor } from "../types/Functor"
import { Applicative } from "../types/Applicative"
import { createMonad, Monad } from "../types/Monad"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"

declare module "../types/Kind" {
  export interface Kind<A> {
    readonly Option: Option<A>
  }
}

export type Option<A> = None | Some<A>

export interface None {
  readonly _tag: "None"
}

export interface Some<A> {
  readonly _tag: "Some"
  readonly value: A
}

type SomeConstructor = <A>(a: A) => Option<A>
export const some: SomeConstructor = value => ({
  _tag: "Some",
  value,
})

export const none: Option<never> = {
  _tag: "None",
}

type IsSome = <A>(fa: Option<A>) => fa is Some<A>
export const isSome: IsSome = fa => fa._tag === "Some"

type IsNone = <A>(fa: Option<A>) => fa is None
export const isNone: IsNone = fa => fa._tag === "None"

type OptionEliminator = <A, B>(fa: Option<A>, b: () => B, f: (a: A) => B) => B
export const option: OptionEliminator = (fa, whenNone, whenSome) =>
  isNone (fa) ? whenNone () : whenSome (fa.value)

type ToOption = <A>(a: A) => Option<NonNullable<A>>
export const toOption: ToOption = a => a == null ? none : some (a)

type FromOption = <A>(a: A) => (fa: Option<A>) => A
export const fromOption: FromOption =
  <A>(a: A) =>
  (fa: Option<A>) =>
    isNone (fa) ? a : fa.value

export const functor: Functor<"Option"> = {
  _URI: "Option",
  pure: some,
  map: (fa, f) => option (fa, () => none, I.compose (some, f)),
}

export const { pure, map } = functor

export const applicative: Applicative<"Option"> = {
  _URI: "Option",
  apply: (fa, ff) =>
    option (
      ff,
      () => none,
      f => option (fa, () => none, I.compose (some, f)),
    ),
}

export const { apply } = applicative

export const monad: Monad<"Option"> = createMonad (functor) ({
  _URI: "Option",
  join: mma => option (mma, () => none, I.identity),
})

export const {
  Do,
  join,
  bind,
  compose,
  mapTo,
  applyTo,
  applyResultTo,
  apS,
  bindTo,
  tap,
  tapIo,
  returnM,
} = monad

type GetMonoid = <A>(semigroup: Semigroup<A>) => Monoid<Option<A>>
export const getMonoid: GetMonoid = s => ({
  empty: none,
  concat: (mx, my) =>
    isNone (mx)
      ? isNone (my)
        ? none
        : my
      : isNone (my)
        ? mx
        : some (s.concat (mx.value, my.value)),
})
