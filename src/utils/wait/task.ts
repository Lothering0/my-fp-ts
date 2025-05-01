import * as T from "../../modules/task"
import * as IO from "../../modules/io"
import { _ } from "../underscore"

type Wait = (n: number) => T.Task<IO.IO<void>>
export const wait: Wait = ms => () =>
  new Promise (f => setTimeout (() => f (IO.pure (_)), ms))
