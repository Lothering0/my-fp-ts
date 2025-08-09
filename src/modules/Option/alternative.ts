import * as alternative from "../../types/Alternative"
import { none, Option, OptionHkt } from "./option"
import { constant } from "../../utils/constant"
import { Alt } from "./alt"

export const zero: {
  <A = never>(): Option<A>
} = constant (none)

export const Alternative: alternative.Alternative<OptionHkt> = {
  ...Alt,
  zero,
}
