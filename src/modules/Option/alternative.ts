import * as alternative from "../../typeclasses/Alternative"
import { none, Option, OptionHkt } from "./option"
import { constant } from "../../utils/constant"
import { Alt } from "./alt"

export const zero: {
  <Out = never>(): Option<Out>
} = constant (none)

export const Alternative: alternative.Alternative<OptionHkt> = {
  ...Alt,
  zero,
}
