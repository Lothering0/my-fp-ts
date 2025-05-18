import * as IO from "../io"
import { URIS } from "../../types/Kind"

declare module "../../types/Kind" {
  interface Kind<A> {
    readonly Task: Task<A>
  }
}

export interface Task<A> extends IO.IO<Promise<A>> {}

export const _URI = "Task" satisfies URIS

type TaskConstructor = <A>(a: A) => Task<A>
export const task: TaskConstructor = a => () => Promise.resolve (a)

type FromTask = <A>(ma: Task<A>) => Promise<A>
export const fromTask: FromTask = ma => ma ()
