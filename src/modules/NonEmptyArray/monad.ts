import * as A from "../Array"
import { NonEmptyArrayHKT } from "./non-empty-array"
import { Monad } from "../../types/Monad"

export const monad: Monad<NonEmptyArrayHKT> = {
  ...A.monad,
} as Monad<NonEmptyArrayHKT>

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
