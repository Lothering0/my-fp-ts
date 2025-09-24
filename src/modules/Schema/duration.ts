import * as result from "../Result"
import * as duration from "../Duration"
import * as boolean from "../Boolean"
import { isNumber, isRecord, isString } from "../../utils/typeChecks"
import { create, Schema } from "./schema"
import { message } from "./process"
import { pipe } from "../../utils/flow"

export const Duration: Schema<duration.DurationInput, duration.Duration> =
  create (x => {
    if (isString (x)) {
      return pipe (
        x,
        duration.fromTemplate,
        result.orElse (
          result.fail ([message`value ${x} is not a valid duration template`]),
        ),
      )
    }

    if (!isNumber (x) && !isRecord (x)) {
      return result.fail ([
        message`value ${x} is not a duration instance or a number of milliseconds`,
      ])
    }

    return pipe (x, duration.make, result.succeed)
  })

const durationProceed: {
  (
    f: (
      durationY: duration.Duration,
    ) => (durationX: duration.Duration) => boolean,
    getMessages: (
      durationX: duration.Duration,
      durationY: duration.Duration,
    ) => ReadonlyArray<string>,
  ): (
    Schema: Schema<duration.Duration>,
  ) => (input: duration.DurationInput) => Schema<duration.Duration>
} = (f, getMessages) => Schema => input =>
  create ((x: duration.Duration) =>
    pipe (
      result.Do,
      result.apS ("durationX", Schema.proceed (x)),
      result.setTo ("durationY", duration.make (input)),
      result.flatMap (({ durationX, durationY }) =>
        pipe (
          durationX,
          f (durationY),
          boolean.match ({
            onTrue: () => result.succeed (x),
            onFalse: () => result.fail (getMessages (durationX, durationY)),
          }),
        ),
      ),
    ),
  )

/** Fails if current duration is not less than or equals to provided */
export const lessThanOrEquals = durationProceed (
  duration.lessThanOrEquals,
  (durationX, durationY) => [
    message`duration should be less than or equal to ${duration.toTemplate (durationY)}, got ${duration.toTemplate (durationX)}`,
  ],
)

/** Fails if current duration is not less than provided */
export const lessThan = durationProceed (
  duration.lessThan,
  (durationX, durationY) => [
    message`duration should be less than ${duration.toTemplate (durationY)}, got ${duration.toTemplate (durationX)}`,
  ],
)

/** Fails if current duration is not more than or equal to provided */
export const moreThanOrEquals = durationProceed (
  duration.moreThanOrEquals,
  (durationX, durationY) => [
    message`duration should be more than or equal to ${duration.toTemplate (durationY)}, got ${duration.toTemplate (durationX)}`,
  ],
)

/** Fails if current duration is not more than provided */
export const moreThan = durationProceed (
  duration.moreThan,
  (durationX, durationY) => [
    message`duration should be more than ${duration.toTemplate (durationY)}, got ${duration.toTemplate (durationX)}`,
  ],
)
