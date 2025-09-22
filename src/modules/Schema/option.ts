import * as option from "../../modules/Option"
import { pipe } from "../../utils/flow"
import { create, Schema } from "./schema"
import { constValid, invalid, message } from "./validation"

export const Option: {
  <A>(schema: Schema<A>): Schema<option.Option<A>>
} = schema =>
  create (x => {
    if (!option.isOption (x)) {
      return invalid ([message`value ${x} is not an option`])
    }

    return pipe (
      x,
      option.match ({
        onSome: schema.validate,
        onNone: constValid,
      }),
    )
  })
