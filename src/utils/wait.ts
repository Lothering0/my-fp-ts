import * as async from "../modules/Async"
import * as sync from "../modules/Sync"
import * as duration_ from "../modules/Duration"
import { Predicate } from "../modules/Predicate"
import { pipe } from "./flow"
import { _ } from "./underscore"
import { doWhile } from "./loops"
import { now } from "./time"

export const wait: {
  (duration: duration_.DurationInput): async.Async<void>
} = duration => () =>
  new Promise (f =>
    setTimeout (
      () => f (_),
      pipe (duration, duration_.make, duration_.toMilliseconds),
    ),
  )

export const waitSync: {
  (duration: duration_.DurationInput): sync.Sync<void>
} = duration => {
  const start = sync.execute (now)
  const milliseconds = pipe (duration, duration_.make, duration_.toMilliseconds)
  const predicate: Predicate<never> = () =>
    sync.execute (now) - start < milliseconds

  return () =>
    pipe (
      predicate,
      doWhile (() => _),
    )
}
