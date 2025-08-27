import * as sync from "../../modules/Sync"
import * as duration_ from "../../modules/Duration"
import { Predicate } from "../../modules/Predicate"
import { getDoWhile } from "../loops"
import { now } from "../time"
import { _ } from "../underscore"
import { pipe } from "../flow"

export const wait: {
  (duration: duration_.DurationInput): sync.Sync<void>
} = duration => {
  const start = sync.execute (now)
  const milliseconds = pipe (duration, duration_.make, duration_.toMilliseconds)
  const predicate: Predicate<void> = () =>
    sync.execute (now) - start < milliseconds
  const doWhile = getDoWhile (sync.Applicative)

  return doWhile (predicate) (() => _)
}
