import * as alternative from "../../typeclasses/Alternative"
import { none, SyncOption, SyncOptionHkt } from "./sync-option"
import { constant } from "../../utils/constant"
import { Alt } from "./alt"

export const zero: {
  <A = never>(): SyncOption<A>
} = constant (none)

export const Alternative: alternative.Alternative<SyncOptionHkt> = {
  ...Alt,
  zero,
}
