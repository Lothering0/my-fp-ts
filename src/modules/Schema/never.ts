import { Schema, create } from "./schema"
import { invalid, message } from "./validation"

export const Never: Schema<never> = create (x =>
  invalid ([message`unexpected value ${x}`]),
)
