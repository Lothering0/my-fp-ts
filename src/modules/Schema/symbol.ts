import * as Result from '../Result'
import { isSymbol } from '../../utils/typeChecks'
import { create, Schema } from './schema'
import { message } from './process'

export const Symbol: Schema<symbol> = create(x => {
  if (!isSymbol(x)) {
    return Result.fail([message`value ${x} is not a symbol`])
  }

  return Result.succeed(x)
})
