import * as readonlyArray from "../ReadonlyArray"
import * as readonlyRecord from "../ReadonlyRecord"
import { create, Schema, Type } from "./schema"
import { pipe } from "../../utils/flow"
import { isRecord } from "../../utils/typeChecks"
import { invalid, message, valid } from "./validation"

export const Record: {
  <K extends Schema<string>, A extends Schema<unknown>>(schemas: {
    readonly key: K
    readonly value: A
  }): Schema<Partial<readonlyRecord.ReadonlyRecord<Type<K>, Type<A>>>>
} = schemas =>
  create (x => {
    if (!isRecord (x)) {
      return invalid ([message`value ${x} is not a record`])
    }

    const messages = pipe (
      x,
      readonlyRecord.map ((a, k) => {
        const keyValidationResult = schemas.key.validate (k)

        if (!keyValidationResult.isValid) {
          return pipe (
            keyValidationResult.messages,
            readonlyArray.map (msg => `${message`property ${k}`}: ${msg}`),
          )
        }

        const valueValidationResult = schemas.value.validate (a)

        if (valueValidationResult.isValid) {
          return []
        }

        return pipe (
          valueValidationResult.messages,
          readonlyArray.map (msg => `${message`on property ${k}`}: ${msg}`),
        )
      }),
      readonlyRecord.values,
      readonlyArray.flat,
    )

    if (messages.length !== 0) {
      return invalid (messages)
    }

    return valid
  })
