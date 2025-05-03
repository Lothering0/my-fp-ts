import * as IO from "../io"
import * as O from "../option"
import * as E from "../either"
import { tryDo } from "../../utils/exceptions"

declare module "../../types/Kind" {
  interface Kind<A> {
    readonly IOOption: IOOption<A>
  }
}

export interface IOOption<A> extends IO.IO<O.Option<A>> {
  (): O.Option<A>
}

type IONoneConstructor = IOOption<never>
export const ioNone: IONoneConstructor = () => O.none

type IOSomeConstructor = <A>(a: A) => IOOption<A>
export const ioSome: IOSomeConstructor = a => () => O.some (a)

type ToIOOption = <A>(ma: IO.IO<A>) => IOOption<A>
export const toIoOption: ToIOOption = ma => () =>
  E.either (tryDo (ma), () => O.none, O.some)

type FromIOOption = <A>(ma: IOOption<A>) => O.Option<A>
export const fromIoOption: FromIOOption = <A>(ma: IOOption<A>) => {
  try {
    return ma ()
  } catch {
    return O.none
  }
}
