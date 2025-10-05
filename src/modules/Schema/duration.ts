import * as Result from '../Result'
import * as Duration_ from '../Duration'
import * as Boolean from '../Boolean'
import { isNumber, isRecord, isString } from '../../utils/typeChecks'
import { create, Schema } from './schema'
import { message } from './process'
import { pipe } from '../../utils/flow'

export const Duration: Schema<Duration_.DurationInput, Duration_.Duration> =
  create(x => {
    if (isString(x)) {
      return pipe(
        x,
        Duration_.fromTemplate,
        Result.orElse(
          Result.fail([message`value ${x} is not a valid duration template`]),
        ),
      )
    }

    if (!isNumber(x) && !isRecord(x)) {
      return Result.fail([
        message`value ${x} is not a duration instance or a number of milliseconds`,
      ])
    }

    return pipe(x, Duration_.make, Result.succeed)
  })

const durationProceed: {
  (
    f: (
      durationY: Duration_.Duration,
    ) => (durationX: Duration_.Duration) => boolean,
    getMessages: (
      durationX: Duration_.Duration,
      durationY: Duration_.Duration,
    ) => ReadonlyArray<string>,
  ): (
    Schema: Schema<Duration_.Duration>,
  ) => (input: Duration_.DurationInput) => Schema<Duration_.Duration>
} = (f, getMessages) => Schema => input =>
  create((x: Duration_.Duration) =>
    pipe(
      Result.Do,
      Result.bind('durationX', Schema.proceed(x)),
      Result.setTo('durationY', Duration_.make(input)),
      Result.flatMap(({ durationX, durationY }) =>
        pipe(
          durationX,
          f(durationY),
          Boolean.match({
            onTrue: () => Result.succeed(x),
            onFalse: () => Result.fail(getMessages(durationX, durationY)),
          }),
        ),
      ),
    ),
  )

/** Fails if current duration is not less than or equals to provided */
export const lessThanOrEquals = durationProceed(
  Duration_.lessThanOrEquals,
  (durationX, durationY) => [
    message`duration should be less than or equal to ${Duration_.toTemplate(durationY)}, got ${Duration_.toTemplate(durationX)}`,
  ],
)

/** Fails if current duration is not less than provided */
export const lessThan = durationProceed(
  Duration_.lessThan,
  (durationX, durationY) => [
    message`duration should be less than ${Duration_.toTemplate(durationY)}, got ${Duration_.toTemplate(durationX)}`,
  ],
)

/** Fails if current duration is not more than or equal to provided */
export const moreThanOrEquals = durationProceed(
  Duration_.moreThanOrEquals,
  (durationX, durationY) => [
    message`duration should be more than or equal to ${Duration_.toTemplate(durationY)}, got ${Duration_.toTemplate(durationX)}`,
  ],
)

/** Fails if current duration is not more than provided */
export const moreThan = durationProceed(
  Duration_.moreThan,
  (durationX, durationY) => [
    message`duration should be more than ${Duration_.toTemplate(durationY)}, got ${Duration_.toTemplate(durationX)}`,
  ],
)
