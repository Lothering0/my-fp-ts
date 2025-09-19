import * as boolean from "../../modules/Boolean"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { isFunction } from "../../utils/typeChecks"
import { Schema } from "./schema"
import { constValid, invalid } from "./validation"

export const func: Schema<(...xs: readonly unknown[]) => unknown> = {
  Type: hole (),
  validate: x =>
    pipe (
      x,
      isFunction,
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([`value ${x} is not a function`]),
      }),
    ),
}
