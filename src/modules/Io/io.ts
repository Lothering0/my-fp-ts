import { HKT } from "../../types/HKT"

export interface IoHKT extends HKT {
  readonly type: Io<this["_A"]>
}

export declare const _F: IoHKT

export interface Io<A> {
  (): A
}

export const io: {
  <A>(a: A): Io<A>
} = a => () => a

export const fromIo: {
  <A>(ma: Io<A>): A
} = ma => ma ()
