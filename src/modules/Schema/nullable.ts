import * as result from "../Result"
import { flow } from "../../utils/flow"
import { isNull, isUndefined } from "../../utils/typeChecks"
import { create, Schema } from "./schema"
import { union } from "./utils"
import { message } from "./validation"

export const Null: Schema<null> = create ({
  validate: x => {
    if (!isNull (x)) {
      return result.fail ([message`value ${x} is not a null`])
    }
    return result.succeed (x)
  },
})

export const Undefined: Schema<undefined> = create (x => {
  if (!isUndefined (x)) {
    return result.fail ([message`value ${x} is not undefined`])
  }
  return result.succeed (x)
})

export const Nullable: {
  <A>(self: Schema<A>): Schema<A | null | undefined>
} = flow (union (Null), union (Undefined))
