import * as boolean_ from "../../modules/Boolean"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { isBoolean } from "../../utils/typeChecks"
import { Schema } from "./schema"
import { constValid, invalid } from "./validation"

export const boolean: Schema<boolean> = {
  Type: hole (),
  validate: x =>
    pipe (
      x,
      isBoolean,
      boolean_.match ({
        onTrue: constValid,
        onFalse: () => invalid ([`value \`${x}\` is not a boolean`]),
      }),
    ),
}
