import * as E from "../Either"
import { URIS } from "../../types/Kind"
import { pipe } from "../../utils/flow"
import { overload2 } from "../../utils/overloads"

declare module "../../types/Kind" {
  interface URIToKind<A> {
    readonly Option: Option<A>
  }
}

export type Option<A> = None | Some<A>

export const _URI = "Option" satisfies URIS

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

type Zero = <A>() => Option<A>
export const zero: Zero = () => none

type IsSome = <A>(fa: Option<A>) => fa is Some<A>
export const isSome: IsSome = fa => fa._tag === "Some"

type IsNone = <A>(fa: Option<A>) => fa is None
export const isNone: IsNone = fa => fa._tag === "None"

type FromSome = <A>(fa: Some<A>) => A
export const fromSome: FromSome = fa => fa.value

interface MatchPointed {
  <A, B>(fa: Option<A>, b: () => B, f: (a: A) => B): B
}

interface Match extends MatchPointed {
  <A, B>(b: () => B, f: (a: A) => B): (fa: Option<A>) => B
}

const matchPointed: MatchPointed = (fa, whenNone, whenSome) =>
  isNone (fa) ? whenNone () : pipe (fa, fromSome, whenSome)

export const match: Match = overload2 (matchPointed)

type ToOption = <A>(a: A) => Option<NonNullable<A>>
export const toOption: ToOption = a => a == null ? none : some (a)

type FromOption = <A>(a: A) => (fa: Option<A>) => A
export const fromOption: FromOption =
  <A>(a: A) =>
  (fa: Option<A>) =>
    isNone (fa) ? a : fromSome (fa)

type FromEither = <_, A>(ma: E.Either<_, A>) => Option<A>
export const fromEither: FromEither = E.match (() => none, some)
