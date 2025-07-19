import * as A from "../../types/Alternative"
import { Alt } from "./alt"
import { ArrayHKT } from "./array"

export const zero: {
  <A>(): A[]
} = () => []

export const Alternative: A.Alternative<ArrayHKT> = {
  ...Alt,
  zero,
}
