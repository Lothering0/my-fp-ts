import * as T from "../../modules/Task"
import { _ } from "../underscore"

export const wait: {
  (ms: number): T.Task<void>
} = ms => () => new Promise (f => setTimeout (() => f (_), ms))
