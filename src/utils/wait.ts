import * as Effect from '../modules/Effect'
import * as Async from '../modules/Async'
import * as Sync from '../modules/Sync'
import * as Duration from '../modules/Duration'
import { Predicate } from '../modules/Predicate'
import { pipe, flow } from './flow'
import { _ } from './underscore'
import { doWhile } from './loops'
import { nowSync } from './time'

export const waitAsync: {
  (duration: Duration.DurationInput): Async.Async<void>
} = duration => () =>
  new Promise(f =>
    setTimeout(
      () => f(_),
      pipe(duration, Duration.make, Duration.toMilliseconds),
    ),
  )

export const wait: {
  (duration: Duration.DurationInput): Effect.Effect<void>
} = flow(waitAsync, Effect.fromAsync)

export const waitSync: {
  (duration: Duration.DurationInput): Sync.Sync<void>
} = duration => {
  const start = Sync.run(nowSync)
  const milliseconds = pipe(duration, Duration.make, Duration.toMilliseconds)
  const predicate: Predicate<never> = () =>
    Sync.run(nowSync) - start < milliseconds

  return () =>
    pipe(
      predicate,
      doWhile(() => _),
    )
}
