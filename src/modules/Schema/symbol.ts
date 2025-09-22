import * as boolean from "../../modules/Boolean"
import { pipe } from "../../utils/flow"
import { isSymbol } from "../../utils/typeChecks"
import { create, Schema } from "./schema"
import { constValid, invalid, message } from "./validation"

export const Symbol: Schema<symbol> = create (x =>
  pipe (
    x,
    isSymbol,
    boolean.match ({
      onTrue: constValid,
      onFalse: () => invalid ([message`value ${x} is not a symbol`]),
    }),
  ),
)
