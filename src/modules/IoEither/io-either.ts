import * as E from "../Either"
import * as Io from "../Io"
import { tryDo } from "../../utils/exceptions"
import { HKT } from "../../types/HKT"

export interface IoEitherHKT extends HKT {
  readonly type: IoEither<this["_E"], this["_A"]>
}

export declare const _F: IoEitherHKT

export interface IoEither<E, A> extends Io.Io<E.Either<E, A>> {}

export const left: {
  <E>(e: E): IoEither<E, never>
} = e => () => E.left (e)

export const right: {
  <A>(a: A): IoEither<never, A>
} = a => () => E.right (a)

export const toIoEither: {
  <E, A>(ma: Io.Io<A>): IoEither<E, A>
} = ma => () => tryDo (ma)

export const fromIoEither: {
  <E, A>(ma: IoEither<E, A>): E.Either<E, A>
} = ma => {
  try {
    return ma ()
  } catch (exception) {
    return E.left (exception)
  }
}
