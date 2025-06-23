/* eslint-disable @typescript-eslint/no-explicit-any */
import * as A from "../Array"
import { URI } from "./non-empty-array"
import { Applicative } from "../../types/Applicative"
import { ApplicativeWithIndex } from "../../types/ApplicativeWithIndex"

export const applicative: Applicative<URI> = {
  ...A.applicative,
  URI,
} as any

export const applicativeWithIndex: ApplicativeWithIndex<URI, number> = {
  ...A.applicativeWithIndex,
  URI,
} as any

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
