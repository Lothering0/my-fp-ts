import * as A from "../../types/Alternative"
import { none, Option, OptionHKT } from "./option"
import { constant } from "../../utils/constant"
import { Alt } from "./alt"

export const zero: {
  <A = never>(): Option<A>
} = constant (none)

export const Alternative: A.Alternative<OptionHKT> = {
  ...Alt,
  zero,
}
