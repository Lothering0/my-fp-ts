import { hole } from "../../utils/hole"
import { Schema } from "./schema"
import { constValid } from "./validation"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const any: Schema<any> = {
  Type: hole (),
  validate: constValid,
}
