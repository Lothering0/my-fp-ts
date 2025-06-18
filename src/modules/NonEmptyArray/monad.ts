/* eslint-disable @typescript-eslint/no-explicit-any */
import * as A from "../Array"
import { URI } from "./non-empty-array"
import { Monad } from "../../types/Monad"

export const monad: Monad<URI> = {
  ...A.monad,
  URI,
} as any

export const {
  Do,
  flat,
  flatMap,
  compose,
  setTo,
  mapTo,
  applyTo,
  apS,
  flatMapTo,
  tap,
  tapIo,
} = monad
