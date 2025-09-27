import * as Result from '../Result'
import { isBoolean } from '../../utils/typeChecks'
import { create, Schema } from './schema'
import { message } from './process'

export const Boolean: Schema<boolean> = create(x => {
  if (!isBoolean(x)) {
    return Result.fail([message`value ${x} is not a boolean`])
  }

  return Result.succeed(x)
})
