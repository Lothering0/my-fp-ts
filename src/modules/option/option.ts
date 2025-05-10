import * as E from "../either"
import { pipe } from "../../utils/flow"
import { overloadWithPointFree2 } from "../../utils/points"

declare module "../../types/Kind" {
  interface Kind<A> {
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
  isNone (fa) ? whenNone () : pipe (fa, fromSome, whenSome)

export const option: OptionEliminator = overloadWithPointFree2 (optionPointed)

type ToOption = <A>(a: A) => Option<NonNullable<A>>
export const toOption: ToOption = a => a == null ? none : some (a)

type FromOption = <A>(a: A) => (fa: Option<A>) => A
export const fromOption: FromOption =
  <A>(a: A) =>
  (fa: Option<A>) =>
    isNone (fa) ? a : fromSome (fa)

type FromEither = <_, A>(ma: E.Either<_, A>) => Option<A>
export const fromEither: FromEither = E.either (() => none, some)
