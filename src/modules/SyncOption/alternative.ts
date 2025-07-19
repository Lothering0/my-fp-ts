import * as A from "../../types/Alternative"
import { none, SyncOption, SyncOptionHKT } from "./sync-option"
import { constant } from "../../utils/constant"
import { Alt } from "./alt"

export const zero: {
  <A = never>(): SyncOption<A>
} = constant (none)

export const Alternative: A.Alternative<SyncOptionHKT> = {
  ...Alt,
  zero,
}
