import * as T from "../../modules/task"
import { _ } from "../underscore"

type Wait = (n: number) => T.Task<void>
export const wait: Wait = ms => () =>
  new Promise (f => setTimeout (() => f (_), ms))
