import * as Result from '../Result'
import { isString } from '../../utils/typeChecks'
import { create, Schema } from './schema'
import { message } from './process'

export const String: Schema<string> = create(x => {
  if (!isString(x)) {
    return Result.fail([message`value ${x} is not a string`])
  }

  return Result.succeed(x)
})
