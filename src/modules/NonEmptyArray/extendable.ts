import * as A from "../Array"
import * as E from "../../types/Extendable"
import { NonEmptyArrayHKT } from "./non-empty-array"

export const Extendable = {
  ...A.Extendable,
} as E.Extendable<NonEmptyArrayHKT>

export const { extend } = Extendable
