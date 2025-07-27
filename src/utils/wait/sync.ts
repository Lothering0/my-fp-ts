import * as sync from "../../modules/Sync"
import { Predicate } from "../../modules/Predicate"
import { getDoWhile } from "../loops"
import { now } from "../time"
import { _ } from "../underscore"

export const wait_: {
  (ms: number): sync.Sync<void>
} = ms => {
  const start = sync.execute (now)
  const predicate: Predicate<void> = () => sync.execute (now) - start < ms
  const doWhile_ = getDoWhile (sync.Applicative)

  return doWhile_ (predicate) (() => _)
}
