import * as Result from '../Result'
import { create, Schema } from './schema'
import { message } from './process'
import { pipe } from '../../utils/flow'
import { NonEmptyReadonlyArray } from '../NonEmptyReadonlyArray'
import { minLength } from './utils'

const array = <A>(schema: Schema<A>): Schema<ReadonlyArray<A>> =>
  create(x => {
    const isArray = Array.isArray(x)

    if (!isArray) {
      return Result.fail([message`value ${x} is not an array`])
    }

    const xs: ReadonlyArray<A> = x
    const out: A[] = []

    for (const i in xs) {
      const processResult = schema.proceed(xs[i])

      if (Result.isFailure(processResult)) {
        const msg = Result.failureOf(processResult)
        return Result.fail([`${message`on index ${i}`}: ${msg}`])
      }

      out.push(Result.successOf(processResult))
    }

    return Result.succeed(out)
  })

export { array as Array }

export const NonEmptyArray = <A>(
  schema: Schema<A>,
): Schema<NonEmptyReadonlyArray<A>> =>
  pipe(schema, array, minLength(1)) as Schema<NonEmptyReadonlyArray<A>>
