import * as result from "../Result"
import { Schema, create } from "./schema"
import { message } from "./validation"

export const Never: Schema<never> = create (x =>
  result.fail ([message`unexpected value ${x}`]),
)
