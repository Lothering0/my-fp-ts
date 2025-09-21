import * as readonlyArray from "../ReadonlyArray"
import * as readonlyRecord from "../ReadonlyRecord"
import { Schema, Type } from "./schema"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { isRecord } from "../../utils/typeChecks"
import { invalid, valid } from "./validation"

export const record: {
  <K extends Schema<string>, A extends Schema<unknown>>(
    keySchema: K,
    valueSchema: A,
  ): Schema<Partial<readonlyRecord.ReadonlyRecord<Type<K>, Type<A>>>>
} = (keySchema, valueSchema) => ({
  Type: hole (),
  validate: x => {
    if (!isRecord (x)) {
      return invalid ([`value \`${x}\` is not a record`])
    }

    const messages = pipe (
      x,
      readonlyRecord.map ((a, k) => {
        const keyValidationResult = keySchema.validate (k)

        if (!keyValidationResult.isValid) {
          return pipe (
            keyValidationResult.messages,
            readonlyArray.map (message => `property \`${k}\`: ${message}`),
          )
        }

        const valueValidationResult = valueSchema.validate (a)

        if (valueValidationResult.isValid) {
          return []
        }

        return pipe (
          valueValidationResult.messages,
          readonlyArray.map (message => `on property \`${k}\`: ${message}`),
        )
      }),
      readonlyRecord.values,
      readonlyArray.flat,
    )

    if (messages.length === 0) {
      return valid
    }

    return invalid (messages)
  },
})
