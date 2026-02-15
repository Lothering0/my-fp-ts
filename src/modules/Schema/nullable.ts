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
  <A>(schema: Schema<A>): Schema<A | null | undefined>
} = flow(union(Null), union(Undefined))

export const orElse: {
  <B>(
    b: B,
  ): <In, A>(
    Schema: Schema<In | null | undefined, A | null | undefined>,
  ) => Schema<In | null | undefined, A | B>
} = b => schema =>
  create(
    flow(
      schema.proceed,
      Result.map(a => (a == null ? b : a)),
    ),
  )

export const getOrElse: {
  <B>(
    f: (x: null | undefined) => B,
  ): <In, A>(
    schema: Schema<In | null | undefined, A | null | undefined>,
  ) => Schema<In | null | undefined, A | B>
} = f => schema =>
  create(
    flow(
      schema.proceed,
      Result.map(a => (a == null ? f(a as null | undefined) : a)),
    ),
  )
