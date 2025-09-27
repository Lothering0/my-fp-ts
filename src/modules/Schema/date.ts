import * as Result from '../Result'
import * as Duration from '../Duration'
import { isDate } from 'node:util/types'
import { isNumber, isRecord, isString } from '../../utils/typeChecks'
import { create, Schema } from './schema'
import { message } from './process'
import { isDateValid } from '../../utils/time'
import { pipe } from '../../utils/flow'

export const DateLike: Schema<Date | Duration.DurationInput, Date> = create(
  x => {
    if (!isDate(x) && isRecord(x)) {
      return pipe(x, Duration.make, Duration.toDate, Result.succeed)
    }

    if (!isNumber(x) && !isString(x) && !isDate(x)) {
      return Result.fail([
        message`value ${x} is not a date instance, duration, string or a number of milliseconds`,
      ])
    }

    if (isString(x)) {
      const dur = Duration.fromTemplate(x)
      if (Result.isSuccess(dur)) {
        return pipe(dur, Result.successOf, Duration.toDate, Result.succeed)
      }
    }

    const date = new Date(x)
    if (!isDateValid(date)) {
      return Result.fail([message`value ${x} is not a valid date`])
    }

    return Result.succeed(date)
  },
)
