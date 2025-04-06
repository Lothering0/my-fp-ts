import { fromIo, IO } from "../../io"
import { doWhile } from "./loops"
import { now } from "./time"
import { _ } from "../../../utils"

type Wait = (a: number) => IO<void>
export const wait: Wait = ms => {
  const start = fromIo (now ())
  type Predicate = () => boolean
  const predicate: Predicate = () => fromIo (now ()) - start < ms

  return doWhile (predicate) (() => _)
}
