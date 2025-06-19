import * as Io from "../Io"
import * as O from "../Option"
import * as E from "../Either"
import { URIS } from "../../types/Kind"
import { tryDo } from "../../utils/exceptions"
import { pipe } from "../../utils/flow"

declare module "../../types/Kind" {
  interface URIToKind<A> {
    readonly IoOption: IoOption<A>
  }
}

export interface IoOption<A> extends Io.Io<O.Option<A>> {}

export const URI = "IoOption" satisfies URIS
export type URI = typeof URI

type NoneConstructor = IoOption<never>
export const none: NoneConstructor = () => O.none

type SomeConstructor = <A>(a: A) => IoOption<A>
export const some: SomeConstructor = a => () => O.some (a)

type ToIoOption = <A>(ma: Io.Io<A>) => IoOption<A>
export const toIoOption: ToIoOption = ma => () =>
  pipe (
    ma,
    tryDo,
    E.match (() => O.none, O.some),
  )

type FromIoOption = <A>(ma: IoOption<A>) => O.Option<A>
export const fromIoOption: FromIoOption = <A>(ma: IoOption<A>) => {
  try {
    return ma ()
  } catch {
    return O.none
  }
}
