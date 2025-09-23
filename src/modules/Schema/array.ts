import * as result from "../Result"
import { create, Schema } from "./schema"
import { message } from "./validation"
import { pipe } from "../../utils/flow"
import { NonEmptyReadonlyArray } from "../NonEmptyReadonlyArray"
import { minLength } from "./utils"

const array = <A>(schema: Schema<A>): Schema<ReadonlyArray<A>> =>
  create (x => {
    const isArray = Array.isArray (x)

    if (!isArray) {
      return result.fail ([message`value ${x} is not an array`])
    }

    const xs: ReadonlyArray<A> = x
    const out: A[] = []

    for (const i in xs) {
      const validationResult = schema.validate (xs[i])

      if (result.isFailure (validationResult)) {
        const msg = result.failure (validationResult)
        return result.fail ([`${message`on index ${i}`}: ${msg}`])
      }

      out.push (result.success (validationResult))
    }

    return result.succeed (out)
  })

export { array as Array }

export const NonEmptyArray = <A>(
  schema: Schema<A>,
): Schema<NonEmptyReadonlyArray<A>> =>
  pipe (schema, array, minLength (1)) as Schema<NonEmptyReadonlyArray<A>>
