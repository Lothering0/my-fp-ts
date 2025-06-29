import * as A from "../Array"
import { NonEmptyArrayHKT } from "./non-empty-array"
import { Applicative } from "../../types/Applicative"
import { ApplicativeWithIndex } from "../../types/ApplicativeWithIndex"

export const applicative: Applicative<NonEmptyArrayHKT> = {
  ...A.applicative,
} as Applicative<NonEmptyArrayHKT>

export const applicativeWithIndex: ApplicativeWithIndex<
  NonEmptyArrayHKT,
  number
> = {
  ...A.applicativeWithIndex,
} as ApplicativeWithIndex<NonEmptyArrayHKT, number>

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
} = applicativeWithIndex
