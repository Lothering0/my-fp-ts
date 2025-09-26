import * as alternative from "../../typeclasses/Alternative"
import { none, AsyncOption, AsyncOptionHkt } from "./async-option"
import { constant } from "../../utils/constant"
import { Alt } from "./alt"

export const zero: {
  <Out = never>(): AsyncOption<Out>
} = constant (none)

export const Alternative: alternative.Alternative<AsyncOptionHkt> = {
  ...Alt,
  zero,
}
