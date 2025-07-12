import * as A from "../Array"
import * as Ap from "../../types/Applicative"
import * as ApI from "../../types/ApplicativeWithIndex"
import { NonEmptyArrayHKT } from "./non-empty-array"

export const Applicative = {
  ...A.Applicative,
} as Ap.Applicative<NonEmptyArrayHKT>

export const ApplicativeWithIndex = {
  ...A.ApplicativeWithIndex,
} as ApI.ApplicativeWithIndex<NonEmptyArrayHKT, number>

export const {
  of,
  ap,
  apply,
  flap,
  flipApply,
  apWithIndex,
  applyWithIndex,
  flapWithIndex,
  flipApplyWithIndex,
} = ApplicativeWithIndex
