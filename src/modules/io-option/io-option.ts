import * as IO from "../io"
import * as O from "../option"
import * as E from "../either"
import { URIS } from "../../types/Kind"
import { tryDo } from "../../utils/exceptions"
import { pipe } from "../../utils/flow"
import { overload2 } from "../../utils/overloads"

declare module "../../types/Kind" {
  interface Kind<A> {
    readonly IOOption: IOOption<A>
  }
}

export interface IOOption<A> extends IO.IO<O.Option<A>> {}

export const _URI = "IOOption" satisfies URIS

type NoneConstructor = IOOption<never>
export const none: NoneConstructor = () => O.none

type SomeConstructor = <A>(a: A) => IOOption<A>
export const some: SomeConstructor = a => () => O.some (a)

type ToIOOption = <A>(ma: IO.IO<A>) => IOOption<A>
export const toIoOption: ToIOOption = ma => () =>
  pipe (
    ma,
    tryDo,
    E.either (() => O.none, O.some),
  )

type FromIOOption = <A>(ma: IOOption<A>) => O.Option<A>
export const fromIoOption: FromIOOption = <A>(ma: IOOption<A>) => {
  try {
    return ma ()
  } catch {
    return O.none
  }
}

interface IOOptionEliminatorPointed {
  <A, B>(fa: IOOption<A>, b: () => B, f: (a: A) => B): B
}

interface IOOptionEliminator extends IOOptionEliminatorPointed {
  <A, B>(fa: IOOption<A>, b: () => B, f: (a: A) => B): B
}

const ioOptionPointed: IOOptionEliminatorPointed = (fa, whenNone, whenSome) =>
  pipe (fa, fromIoOption, O.option (whenNone, whenSome))

export const ioOption: IOOptionEliminator = overload2 (ioOptionPointed)
