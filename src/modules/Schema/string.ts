import * as boolean from "../../modules/Boolean"
import { pipe } from "../../utils/flow"
import { isString } from "../../utils/typeChecks"
import { create, Schema } from "./schema"
import { constValid, invalid, message } from "./validation"

export const String: Schema<string> = create (x =>
  pipe (
    x,
    isString,
    boolean.match ({
      onTrue: constValid,
      onFalse: () => invalid ([message`value ${x} is not a string`]),
    }),
  ),
)
