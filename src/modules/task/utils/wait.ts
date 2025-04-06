import * as T from "../../task"
import * as IO from "../../io"

type Wait = (n: number) => T.Task<IO.IO<void>>
export const wait: Wait = ms => T.toTask (new Promise (f => setTimeout (f, ms)))
