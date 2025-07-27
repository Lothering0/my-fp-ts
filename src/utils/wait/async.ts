import * as async from "../../modules/Async"
import { _ } from "../underscore"

export const wait: {
  (ms: number): async.Async<void>
} = ms => () => new Promise (f => setTimeout (() => f (_), ms))
