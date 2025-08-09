import * as alternative from "../../types/Alternative"
import { none, AsyncOption, AsyncOptionHkt } from "./async-option"
import { constant } from "../../utils/constant"
import { Alt } from "./alt"

export const zero: {
  <A = never>(): AsyncOption<A>
} = constant (none)

export const Alternative: alternative.Alternative<AsyncOptionHkt> = {
  ...Alt,
  zero,
}
