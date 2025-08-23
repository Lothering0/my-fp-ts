import { Hkt } from "../../types/Hkt"

export interface OptionHkt extends Hkt {
  readonly type: Option<this["_in"]>
}

export type Option<A> = None | Some<A>

export interface None {
  readonly _tag: "None"
}

export interface Some<A> {
  readonly _tag: "Some"
  readonly value: A
}

export const some: {
  <A>(a: A): Option<A>
} = value => ({
  _tag: "Some",
  value,
})

export const none: Option<never> = {
  _tag: "None",
}
