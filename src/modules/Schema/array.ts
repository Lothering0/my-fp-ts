import * as option from "../../modules/Option"
import * as readonlyArray from "../ReadonlyArray"
import { create, Schema } from "./schema"
import { constValid, invalid, message, ValidationResult } from "./validation"
import { pipe } from "../../utils/flow"
import { NonEmptyReadonlyArray } from "../NonEmptyReadonlyArray"
import { minLength } from "./utils"

const array: {
  <A>(schema: Schema<A>): Schema<ReadonlyArray<A>>
} = schema =>
  create (xs => {
    const isArray = Array.isArray (xs)

    if (!isArray) {
      return invalid ([message`value ${xs} is not an array`])
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
          readonlyArray.map (msg => message`on index ${i}: ${msg}`),
          invalid,
          option.some,
        )
      }),
    )

    return pipe (invalidElement, option.getOrElse (constValid))
  })

export { array as Array }

export const NonEmptyArray = <A>(
  schema: Schema<A>,
): Schema<NonEmptyReadonlyArray<A>> =>
  pipe (schema, array, minLength (1)) as Schema<NonEmptyReadonlyArray<A>>
