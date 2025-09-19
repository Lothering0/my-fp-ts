import * as option from "../../modules/Option"
import * as boolean from "../../modules/Boolean"
import * as readonlyArray from "../ReadonlyArray"
import * as readonlyRecord from "../ReadonlyRecord"
import { Schema, Type } from "./schema"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { isRecord } from "../../utils/typeChecks"
import { constValid, invalid } from "./validation"

export const record: {
  <K extends Schema<string>, A extends Schema<unknown>>(
    keySchema: K,
    valueSchema: A,
  ): Schema<readonlyRecord.ReadonlyRecord<Type<K>, Type<A>>>
} = (keySchema, valueSchema) => ({
  Type: hole (),
  validate: x => {
    if (!isRecord (x)) {
      return invalid ([`value ${x} is not a record`])
    }

    const invalidElement = pipe (
      x,
      readonlyRecord.findMap ((a, k) => {
        const keyValidationResult = keySchema.validate (k)

        if (!keyValidationResult.isValid) {
          return pipe (
            keyValidationResult.messages,
            readonlyArray.map (message => `property ${k}: ${message}`),
            invalid,
            option.some,
          )
        }

        const valueValidationResult = valueSchema.validate (a)

        return pipe (
          valueValidationResult.isValid,
          boolean.match ({
            onTrue: option.zero,
            onFalse: () =>
              pipe (
                valueValidationResult.messages,
                readonlyArray.map (message => `on property ${k}: ${message}`),
                invalid,
                option.some,
              ),
          }),
        )
      }),
    )

    return pipe (invalidElement, option.getOrElse (constValid))
  },
})
