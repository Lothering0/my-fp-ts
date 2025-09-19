import * as boolean from "../../modules/Boolean"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { isString } from "../../utils/typeChecks"
import { Schema } from "./schema"
import { constValid, invalid } from "./validation"

export const string: Schema<string> = {
  Type: hole (),
  validate: x =>
    pipe (
      x,
      isString,
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([`value ${x} is not a number`]),
      }),
    ),
}
