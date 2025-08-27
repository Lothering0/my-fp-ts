import * as async from "../../modules/Async"
import * as duration_ from "../../modules/Duration"
import { pipe } from "../flow"
import { _ } from "../underscore"

export const wait: {
  (duration: duration_.DurationInput): async.Async<void>
} = duration => () =>
  new Promise (f =>
    setTimeout (
      () => f (_),
      pipe (duration, duration_.make, duration_.toMilliseconds),
    ),
  )
