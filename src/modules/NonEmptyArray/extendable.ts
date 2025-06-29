import * as A from "../Array"
import { Extendable } from "../../types/Extendable"
import { NonEmptyArrayHKT } from "./non-empty-array"

export const extendable: Extendable<NonEmptyArrayHKT> = {
  ...A.extendable,
} as Extendable<NonEmptyArrayHKT>

export const { extend } = extendable
