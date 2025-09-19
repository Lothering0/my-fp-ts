import * as option_ from "../../modules/Option"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { Schema } from "./schema"
import { constValid, invalid } from "./validation"

export const option: {
  <A>(schema: Schema<A>): Schema<option_.Option<A>>
} = schema => ({
  Type: hole (),
  validate: x => {
    if (!option_.isOption (x)) {
      return invalid ([`value ${x} is not an option`])
    }

    return pipe (
      x,
      option_.match ({
        onSome: schema.validate,
        onNone: constValid,
      }),
    )
  },
})
