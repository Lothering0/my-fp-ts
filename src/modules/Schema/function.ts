import * as result from "../Result"
import { isFunction } from "../../utils/typeChecks"
import { create, Schema } from "./schema"
import { message } from "./process"

export const Function: Schema<(...xs: readonly unknown[]) => unknown> = create (
  x => {
    if (!isFunction (x)) {
      return result.fail ([message`value ${x} is not a function`])
    }
    return result.succeed (x)
  },
)
