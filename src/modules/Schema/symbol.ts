import * as boolean from "../../modules/Boolean"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { isSymbol } from "../../utils/typeChecks"
import { Schema } from "./schema"
import { constValid, invalid } from "./validation"

export const symbol: Schema<symbol> = {
  Type: hole (),
  validate: x =>
    pipe (
      x,
      isSymbol,
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([`value ${x} is not a symbol`]),
      }),
    ),
}
