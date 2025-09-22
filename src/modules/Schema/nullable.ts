import * as boolean from "../../modules/Boolean"
import { flow, pipe } from "../../utils/flow"
import {
  isNull as isNull_,
  isUndefined as isUndefined_,
} from "../../utils/typeChecks"
import { create, Schema } from "./schema"
import { union } from "./utils"
import { constValid, invalid, message } from "./validation"

export const Null: Schema<null> = create ({
  validate: x =>
    pipe (
      x,
      isNull_,
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([message`value ${x} is not a null`]),
      }),
    ),
})

export const Undefined: Schema<undefined> = create (x =>
  pipe (
    x,
    isUndefined_,
    boolean.match ({
      onTrue: constValid,
      onFalse: () => invalid ([message`value ${x} is not undefined`]),
    }),
  ),
)

export const Nullable: {
  <A>(self: Schema<A>): Schema<A | null | undefined>
} = flow (union (Null), union (Undefined))
