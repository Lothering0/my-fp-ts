import * as boolean from "../../modules/Boolean"
import { flow, pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import {
  isNull as isNull_,
  isUndefined as isUndefined_,
} from "../../utils/typeChecks"
import { Schema } from "./schema"
import { union } from "./utils"
import { constValid, invalid } from "./validation"

export const isNull: Schema<null> = {
  Type: hole (),
  validate: x =>
    pipe (
      x,
      isNull_,
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([`value \`${x}\` is not a null`]),
      }),
    ),
}

export const isUndefined: Schema<undefined> = {
  Type: hole (),
  validate: x =>
    pipe (
      x,
      isUndefined_,
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([`value \`${x}\` is not undefined`]),
      }),
    ),
}

export const nullable: {
  <A>(self: Schema<A>): Schema<A | null | undefined>
} = flow (union (isNull), union (isUndefined))
