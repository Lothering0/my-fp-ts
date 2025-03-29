import { id, compose } from "../utils"
import { Applicative, Functor, Monad } from "../types"

declare module "../types" {
  export interface Kind<A> {
    readonly Option: Option<A>
  }
}

export type Option<A> = None | Some<A>

export interface None {
  readonly _tag: "NONE"
}

export interface Some<A> {
  readonly _tag: "SOME"
  readonly value: A
}

type SomeConstructor = <A>(a: A) => Option<A>
export const some: SomeConstructor = value => ({
  _tag: "SOME",
  value,
})

export const none: Option<never> = {
  _tag: "NONE",
}

type IsSome = <A>(fa: Option<A>) => fa is Some<A>
export const isSome: IsSome = fa => fa._tag === "SOME"

type IsNone = <A>(fa: Option<A>) => fa is None
export const isNone: IsNone = fa => fa._tag === "NONE"

type OptionEliminator = <A, B>(fa: Option<A>, b: B, f: (a: A) => B) => B
export const option: OptionEliminator = (fa, whenNone, whenSome) =>
  isNone (fa) ? whenNone : whenSome (fa.value)

type FromOption = <A>(a: A) => (fa: Option<A>) => A
export const fromOption: FromOption =
  <A>(a: A) =>
  (fa: Option<A>) =>
    isNone (fa) ? a : fa.value

export const functor: Functor<"Option"> = {
  _URI: "Option",
  pure: some,
  map: (fa, f) => option (fa, none, compose (some, f)),
}

export const { pure, map } = functor

export const applicative: Applicative<"Option"> = {
  _URI: "Option",
  apply: (fa, ff) => option (ff, none, f => option (fa, none, compose (some, f))),
}

export const { apply } = applicative

export const monad: Monad<"Option"> = {
  _URI: "Option",
  join: mma => option (mma, none, id),
  bind: (ma, f) => option (ma, none, f),
}

export const { join, bind } = monad

export const Do: Option<{}> = some ({})
