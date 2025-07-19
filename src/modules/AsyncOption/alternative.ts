import * as A from "../../types/Alternative"
import { none, AsyncOption, AsyncOptionHKT } from "./async-option"
import { constant } from "../../utils/constant"
import { Alt } from "./alt"

export const zero: {
  <A = never>(): AsyncOption<A>
} = constant (none)

export const Alternative: A.Alternative<AsyncOptionHKT> = {
  ...Alt,
  zero,
}
