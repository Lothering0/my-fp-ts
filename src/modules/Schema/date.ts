import * as result from "../Result"
import * as duration from "../Duration"
import { isDate } from "node:util/types"
import { isNumber, isRecord, isString } from "../../utils/typeChecks"
import { create, Schema } from "./schema"
import { message } from "./process"
import { isDateValid } from "../../utils/time"
import { pipe } from "../../utils/flow"

export const DateLike: Schema<Date | duration.DurationInput, Date> = create (
  x => {
    if (!isDate (x) && isRecord (x)) {
      return pipe (x, duration.make, duration.toDate, result.succeed)
    }

    if (!isNumber (x) && !isString (x) && !isDate (x)) {
      return result.fail ([
        message`value ${x} is not a date instance, duration, string or a number of milliseconds`,
      ])
    }

    if (isString (x)) {
      const dur = duration.fromTemplate (x)
      if (result.isSuccess (dur)) {
        return pipe (dur, result.successOf, duration.toDate, result.succeed)
      }
    }

    const date = new Date (x)
    if (!isDateValid (date)) {
      return result.fail ([message`value ${x} is not a valid date`])
    }

    return result.succeed (date)
  },
)
