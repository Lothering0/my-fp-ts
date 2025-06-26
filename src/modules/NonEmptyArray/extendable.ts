/* eslint-disable @typescript-eslint/no-explicit-any */
import * as A from "../Array"
import { Extendable } from "../../types/Extendable"
import { URI } from "./non-empty-array"

export const extendable: Extendable<URI> = {
  ...A.extendable,
  URI,
} as any

export const { extend } = extendable
