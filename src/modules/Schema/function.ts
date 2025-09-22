import * as boolean from "../../modules/Boolean"
import { pipe } from "../../utils/flow"
import { isFunction } from "../../utils/typeChecks"
import { create, Schema } from "./schema"
import { constValid, invalid, message } from "./validation"

export const Function: Schema<(...xs: readonly unknown[]) => unknown> = create (
  x =>
    pipe (
      x,
      isFunction,
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([message`value ${x} is not a function`]),
      }),
    ),
)
