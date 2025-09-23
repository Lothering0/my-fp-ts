import * as result from "../Result"
import * as readonlyArray from "../ReadonlyArray"
import * as readonlyRecord from "../ReadonlyRecord"
import { create, Schema, Type } from "./schema"
import { pipe } from "../../utils/flow"
import { isRecord } from "../../utils/typeChecks"
import { message } from "./validation"

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
      const keyValidationResult = schemas.key.validate (k)

      if (result.isFailure (keyValidationResult)) {
        const keyMessages = pipe (
          keyValidationResult,
          result.mapLeft (
            readonlyArray.map (msg => `${message`property ${k}`}: ${msg}`),
          ),
          result.failure,
        )
        messages = [...messages, ...keyMessages]
        continue
      }

      const valueValidationResult = schemas.value.validate (x[k])

      if (result.isFailure (valueValidationResult)) {
        const valueMessages = pipe (
          valueValidationResult,
          result.mapLeft (
            readonlyArray.map (msg => `${message`on property ${k}`}: ${msg}`),
          ),
          result.failure,
        )
        messages = [...messages, ...valueMessages]
        continue
      }

      const key: Type<K> = result.success (keyValidationResult)
      const value = result.success (valueValidationResult)
      out[key] = value
    }

    if (messages.length !== 0) {
      return result.fail (messages)
    }

    return result.succeed (out)
  })
