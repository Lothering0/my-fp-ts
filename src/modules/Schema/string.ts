import * as result from "../Result"
import { isString } from "../../utils/typeChecks"
import { create, Schema } from "./schema"
import { message } from "./process"

export const String: Schema<string> = create (x => {
  if (!isString (x)) {
    return result.fail ([message`value ${x} is not a string`])
  }

  return result.succeed (x)
})
