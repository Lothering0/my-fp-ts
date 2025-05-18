/* eslint-disable @typescript-eslint/no-explicit-any */
import * as A from "../array"
import { _URI } from "./non-empty-array"
import { Applicative } from "../../types/Applicative"
import { ApplicativeWithIndex } from "../../types/ApplicativeWithIndex"

export const applicative: Applicative<typeof _URI> = {
  ...A.applicative,
  _URI,
} as any

export const applicativeWithIndex: ApplicativeWithIndex<typeof _URI, number> = {
  ...A.applicativeWithIndex,
  _URI,
} as any

export const { of, apply, applyWithIndex } = applicativeWithIndex
