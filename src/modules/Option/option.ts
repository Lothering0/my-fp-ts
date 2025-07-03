import { HKT } from "../../types/HKT"

export interface OptionHKT extends HKT {
  readonly type: Option<this["_A"]>
}

export declare const _F: OptionHKT

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
