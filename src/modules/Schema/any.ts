import { create, Schema } from "./schema"
import { constValid } from "./validation"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Any: Schema<any> = create (constValid)
