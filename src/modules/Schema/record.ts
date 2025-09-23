import * as result from "../Result"
import * as readonlyArray from "../ReadonlyArray"
import * as readonlyRecord from "../ReadonlyRecord"
import { create, Schema, Type } from "./schema"
import { pipe } from "../../utils/flow"
import { isRecord } from "../../utils/typeChecks"
import { message } from "./process"

export const Record = <
  K extends Schema<string>,
  A extends Schema<unknown>,
>(schemas: {
  readonly key: K
  readonly value: A
}): Schema<Partial<readonlyRecord.ReadonlyRecord<Type<K>, Type<A>>>> =>
  create (x => {
    if (!isRecord (x)) {
      return result.fail ([message`value ${x} is not a record`])
    }

    const out: Partial<readonlyRecord.ReadonlyRecord<Type<K>, Type<A>>> = {}
    let messages: string[] = []
    for (const k in x) {
      const keyProcessResult = schemas.key.proceed (k)

      if (result.isFailure (keyProcessResult)) {
        const keyMessages = pipe (
          keyProcessResult,
          result.mapLeft (
            readonlyArray.map (msg => `${message`property ${k}`}: ${msg}`),
          ),
          result.failure,
        )
        messages = [...messages, ...keyMessages]
        continue
      }

      const valueProcessResult = schemas.value.proceed (x[k])

      if (result.isFailure (valueProcessResult)) {
        const valueMessages = pipe (
          valueProcessResult,
          result.mapLeft (
            readonlyArray.map (msg => `${message`on property ${k}`}: ${msg}`),
          ),
          result.failure,
        )
        messages = [...messages, ...valueMessages]
        continue
      }

      const key: Type<K> = result.success (keyProcessResult)
      const value = result.success (valueProcessResult)
      out[key] = value
    }

    if (messages.length !== 0) {
      return result.fail (messages)
    }

    return result.succeed (out)
  })
