import * as Result from '../Result'
import * as Array from '../ReadonlyArray'
import * as Record_ from '../ReadonlyRecord'
import { create, Schema, Type } from './schema'
import { pipe } from '../../utils/flow'
import { isRecord } from '../../utils/typeChecks'
import { message } from './process'

export const Record = <
  K extends Schema<string>,
  A extends Schema<unknown>,
>(schemas: {
  readonly key: K
  readonly value: A
}): Schema<Partial<Record_.ReadonlyRecord<Type<K>, Type<A>>>> =>
  create(x => {
    if (!isRecord(x)) {
      return Result.fail([message`value ${x} is not a record`])
    }

    const out: Partial<Record_.ReadonlyRecord<Type<K>, Type<A>>> = {}
    let messages: string[] = []
    for (const k in x) {
      const keyProcessResult = schemas.key.proceed(k)

      if (Result.isFailure(keyProcessResult)) {
        const keyMessages = pipe(
          keyProcessResult,
          Result.mapLeft(Array.map(msg => `${message`property ${k}`}: ${msg}`)),
          Result.failureOf,
        )
        messages = [...messages, ...keyMessages]
        continue
      }

      const valueProcessResult = schemas.value.proceed(x[k])

      if (Result.isFailure(valueProcessResult)) {
        const valueMessages = pipe(
          valueProcessResult,
          Result.mapLeft(
            Array.map(msg => `${message`on property ${k}`}: ${msg}`),
          ),
          Result.failureOf,
        )
        messages = [...messages, ...valueMessages]
        continue
      }

      const key: Type<K> = Result.successOf(keyProcessResult)
      const value = Result.successOf(valueProcessResult)
      out[key] = value
    }

    if (messages.length !== 0) {
      return Result.fail(messages)
    }

    return Result.succeed(out)
  })
