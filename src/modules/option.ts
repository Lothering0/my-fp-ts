import * as I from "./identity"
import { createFunctor, Functor } from "../types/Functor"
import { createApplicative, Applicative } from "../types/Applicative"
import { createMonad, Monad } from "../types/Monad"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"
import { overloadWithPointFree2 } from "../utils/points"

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

type FromSome = <A>(fa: Some<A>) => A
export const fromSome: FromSome = fa => fa.value

interface OptionEliminatorPointed {
  <A, B>(fa: Option<A>, b: () => B, f: (a: A) => B): B
}

interface OptionEliminator extends OptionEliminatorPointed {
  <A, B>(b: () => B, f: (a: A) => B): (fa: Option<A>) => B
}

const optionPointed: OptionEliminatorPointed = (fa, whenNone, whenSome) =>
  isNone (fa) ? whenNone () : whenSome (fromSome (fa))

export const option: OptionEliminator = overloadWithPointFree2 (optionPointed)

type ToOption = <A>(a: A) => Option<NonNullable<A>>
export const toOption: ToOption = a => a == null ? none : some (a)

type FromOption = <A>(a: A) => (fa: Option<A>) => A
export const fromOption: FromOption =
  <A>(a: A) =>
  (fa: Option<A>) =>
    isNone (fa) ? a : fromSome (fa)

export const functor: Functor<"Option"> = createFunctor ({
  _URI: "Option",
  pure: some,
  map: (fa, f) => option (fa, () => none, I.compose (some, f)),
})

export const { pure, map } = functor

export const applicative: Applicative<"Option"> = createApplicative ({
  _URI: "Option",
  apply: (fa, ff) =>
    option (
      ff,
      () => none,
      f => option (fa, () => none, I.compose (some, f)),
    ),
})

export const { apply } = applicative

export const monad: Monad<"Option"> = createMonad (functor) ({
  _URI: "Option",
  flat: mma => option (mma, () => none, I.identity),
})

export const {
  Do,
  flat,
  bind,
  compose,
  mapTo,
  applyTo,
  applyResultTo,
  apS,
  bindTo,
  tap,
  tapIo,
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
        : some (s.concat (fromSome (mx), fromSome (my))),
})
