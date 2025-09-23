import * as result from "../Result"
import { isBoolean } from "../../utils/typeChecks"
import { create, Schema } from "./schema"
import { message } from "./process"

export const Boolean: Schema<boolean> = create (x => {
  if (!isBoolean (x)) {
    return result.fail ([message`value ${x} is not a boolean`])
  }

  return result.succeed (x)
})
