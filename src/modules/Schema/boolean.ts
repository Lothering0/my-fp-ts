import * as boolean_ from "../../modules/Boolean"
import { pipe } from "../../utils/flow"
import { isBoolean } from "../../utils/typeChecks"
import { create, Schema } from "./schema"
import { constValid, invalid, message } from "./validation"

export const Boolean: Schema<boolean> = create (x =>
  pipe (
    x,
    isBoolean,
    boolean_.match ({
      onTrue: constValid,
      onFalse: () => invalid ([message`value ${x} is not a boolean`]),
    }),
  ),
)
