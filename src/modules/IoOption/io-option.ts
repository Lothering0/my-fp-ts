import * as Io from "../Io"
import * as O from "../Option"
import * as E from "../Either"
import { URIS } from "../../types/Kind"
import { tryDo } from "../../utils/exceptions"
import { pipe } from "../../utils/flow"
import { overload2 } from "../../utils/overloads"

declare module "../../types/Kind" {
  interface Kind<A> {
    readonly IoOption: IoOption<A>
  }
}

export interface IoOption<A> extends Io.Io<O.Option<A>> {}

export const _URI = "IoOption" satisfies URIS

type NoneConstructor = IoOption<never>
export const none: NoneConstructor = () => O.none

type SomeConstructor = <A>(a: A) => IoOption<A>
export const some: SomeConstructor = a => () => O.some (a)

type ToIoOption = <A>(ma: Io.Io<A>) => IoOption<A>
export const toIoOption: ToIoOption = ma => () =>
  pipe (
    ma,
    tryDo,
    E.either (() => O.none, O.some),
  )

type FromIoOption = <A>(ma: IoOption<A>) => O.Option<A>
export const fromIoOption: FromIoOption = <A>(ma: IoOption<A>) => {
  try {
    return ma ()
  } catch {
    return O.none
  }
}

interface IoOptionEliminatorPointed {
  <A, B>(fa: IoOption<A>, b: () => B, f: (a: A) => B): B
}

interface IoOptionEliminator extends IoOptionEliminatorPointed {
  <A, B>(fa: IoOption<A>, b: () => B, f: (a: A) => B): B
}

const ioOptionPointed: IoOptionEliminatorPointed = (fa, whenNone, whenSome) =>
  pipe (fa, fromIoOption, O.option (whenNone, whenSome))

export const ioOption: IoOptionEliminator = overload2 (ioOptionPointed)
