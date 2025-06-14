import { Predicate } from "../../modules/Predicate"
import * as Io from "../../modules/Io"
import { getDoWhile } from "../loops"
import { now } from "../time"
import { _ } from "../underscore"

type Wait_ = (a: number) => Io.Io<void>
export const wait_: Wait_ = ms => {
  const start = Io.fromIo (now)
  const predicate: Predicate<void> = () => Io.fromIo (now) - start < ms
  const doWhile_ = getDoWhile (Io.applicative)

  return doWhile_ (predicate) (() => _)
}
