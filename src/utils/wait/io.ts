import { Predicate } from "../../modules/predicate"
import * as IO from "../../modules/io"
import { getDoWhile } from "../loops"
import { now } from "../time"
import { _ } from "../underscore"

type Wait_ = (a: number) => IO.IO<void>
export const wait_: Wait_ = ms => {
  const start = IO.fromIo (now)
  const predicate: Predicate<void> = () => IO.fromIo (now) - start < ms
  const doWhile_ = getDoWhile (IO.functor)

  return doWhile_ (predicate) (() => _)
}
