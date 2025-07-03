import * as Io from "../Io"
import * as O from "../Option"
import * as E from "../Either"
import { tryDo } from "../../utils/exceptions"
import { pipe } from "../../utils/flow"
import { HKT } from "../../types/HKT"

export interface IoOptionHKT extends HKT {
  readonly type: IoOption<this["_A"]>
}

export declare const _F: IoOptionHKT

export interface IoOption<A> extends Io.Io<O.Option<A>> {}

export const none: IoOption<never> = () => O.none

export const some: {
  <A>(a: A): IoOption<A>
} = a => () => O.some (a)

export const toIoOption: {
  <A>(ma: Io.Io<A>): IoOption<A>
} = ma => () =>
  pipe (
    ma,
    tryDo,
    E.match (() => O.none, O.some),
  )

export const fromIoOption: {
  <A>(ma: IoOption<A>): O.Option<A>
} = <A>(ma: IoOption<A>) => {
  try {
    return ma ()
  } catch {
    return O.none
  }
}
