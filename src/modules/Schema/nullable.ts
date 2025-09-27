import * as Result from '../Result'
import { flow } from '../../utils/flow'
import { isNull, isUndefined } from '../../utils/typeChecks'
import { create, Schema } from './schema'
import { union } from './utils'
import { message } from './process'

export const Null: Schema<null> = create({
  proceed: x => {
    if (!isNull(x)) {
      return Result.fail([message`value ${x} is not a null`])
    }
    return Result.succeed(x)
  },
})

export const Undefined: Schema<undefined> = create(x => {
  if (!isUndefined(x)) {
    return Result.fail([message`value ${x} is not undefined`])
  }
  return Result.succeed(x)
})

export const Nullable: {
  <A>(self: Schema<A>): Schema<A | null | undefined>
} = flow(union(Null), union(Undefined))
