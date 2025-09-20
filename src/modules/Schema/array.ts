import * as option from "../../modules/Option"
import * as readonlyArray from "../ReadonlyArray"
import { hole } from "../../utils/hole"
import { Schema } from "./schema"
import { constValid, invalid, ValidationResult } from "./validation"
import { pipe } from "../../utils/flow"
import { NonEmptyReadonlyArray } from "../NonEmptyReadonlyArray"
import { minLength } from "./utils"

export const array: {
  <A>(schema: Schema<A>): Schema<ReadonlyArray<A>>
} = schema => ({
  Type: hole (),
  validate: xs => {
    const isArray = Array.isArray (xs)

    if (!isArray) {
      return invalid ([`value ${xs} is not an array`])
    }

    const invalidElement: option.Option<ValidationResult> = pipe (
      xs,
      readonlyArray.findMap ((a, i) => {
        const validationResult = schema.validate (a)

        if (validationResult.isValid) {
          return option.none
        }

        return pipe (
          validationResult.messages,
          readonlyArray.map (message => `on index ${i}: ${message}`),
          invalid,
          option.some,
        )
      }),
    )

    return pipe (invalidElement, option.getOrElse (constValid))
  },
})

export const nonEmptyArray = <A>(
  schema: Schema<A>,
): Schema<NonEmptyReadonlyArray<A>> =>
  pipe (schema, array, minLength (1)) as Schema<NonEmptyReadonlyArray<A>>
