import { HKT } from "../../types/HKT"
import * as Io from "../Io"

export interface TaskHKT extends HKT {
  readonly type: Task<this["_A"]>
}

export interface Task<A> extends Io.Io<Promise<A>> {}

export const task: {
  <A>(a: A): Task<A>
} = a => () => Promise.resolve (a)

export const fromTask: {
  <A>(ma: Task<A>): Promise<A>
} = ma => ma ()
