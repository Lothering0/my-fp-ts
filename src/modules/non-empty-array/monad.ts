/* eslint-disable @typescript-eslint/no-explicit-any */
import * as A from "../array"
import { _URI } from "./non-empty-array"
import { Monad } from "../../types/Monad"

export const monad: Monad<typeof _URI> = {
  ...A.monad,
  _URI,
} as any

export const {
  Do,
  flat,
  flatMap,
  compose,
  setTo,
  mapTo,
  applyTo,
  applyResultTo,
  apS,
  flatMapTo,
  tap,
  tapIo,
} = monad
