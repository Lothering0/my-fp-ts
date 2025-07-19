import * as A from "../../types/Alt"
import { concat } from "./utils"
import { ArrayHKT } from "./array"

export const orElse: {
  <A, B>(that: B[]): (self: A[]) => (A | B)[]
  <A, B>(self: A[], that: B[]): (A | B)[]
} = concat

export const Alt: A.Alt<ArrayHKT> = {
  orElse,
}
