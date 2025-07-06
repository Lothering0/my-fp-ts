import * as A from "../../modules/Async"
import { _ } from "../underscore"

export const wait: {
  (ms: number): A.Async<void>
} = ms => () => new Promise (f => setTimeout (() => f (_), ms))
