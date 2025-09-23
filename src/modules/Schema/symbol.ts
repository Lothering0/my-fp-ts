import * as result from "../Result"
import { isSymbol } from "../../utils/typeChecks"
import { create, Schema } from "./schema"
import { message } from "./process"

export const Symbol: Schema<symbol> = create (x => {
  if (!isSymbol (x)) {
    return result.fail ([message`value ${x} is not a symbol`])
  }

  return result.succeed (x)
})
