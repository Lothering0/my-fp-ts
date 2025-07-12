import * as A from "../Array"
import * as M from "../../types/Monad"
import { NonEmptyArrayHKT } from "./non-empty-array"

export const Monad = {
  ...A.Monad,
} as M.Monad<NonEmptyArrayHKT>

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
  tapSync,
} = Monad
