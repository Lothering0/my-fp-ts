import * as Async from '../modules/Async'
import * as Sync from '../modules/Sync'
import * as Duration_ from '../modules/Duration'
import { Predicate } from '../modules/Predicate'
import { pipe } from './flow'
import { _ } from './underscore'
import { doWhile } from './loops'
import { now } from './time'

export const wait: {
  (duration: Duration_.DurationInput): Async.Async<void>
} = duration => () =>
  new Promise(f =>
    setTimeout(
      () => f(_),
      pipe(duration, Duration_.make, Duration_.toMilliseconds),
    ),
  )

export const waitSync: {
  (duration: Duration_.DurationInput): Sync.Sync<void>
} = duration => {
  const start = Sync.execute(now)
  const milliseconds = pipe(duration, Duration_.make, Duration_.toMilliseconds)
  const predicate: Predicate<never> = () =>
    Sync.execute(now) - start < milliseconds

  return () =>
    pipe(
      predicate,
      doWhile(() => _),
    )
}
