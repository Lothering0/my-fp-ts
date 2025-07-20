import * as A from "../../types/Alt"
import * as R from "../Result"
import { identity } from "../Identity"
import { SyncResult, SyncResultHKT, execute, success } from "./sync-result"
import { match } from "./utils"
import { constant } from "../../utils/constant"
import { overload } from "../../utils/overloads"
import { pipe } from "../../utils/flow"

export const getOrElse: {
  <E, A, B>(onFailure: (e: E) => B): (self: SyncResult<E, A>) => A | B
  <E, A, B>(self: SyncResult<E, A>, onFailure: (e: E) => B): A | B
} = overload (1, (self, onFailure) => match (self, onFailure, identity))

export const orElse: {
  <E1, E2, A>(
    onFailure: SyncResult<E2, A>,
  ): (self: SyncResult<E1, A>) => SyncResult<E2, A>
  <E1, E2, A>(
    self: SyncResult<E1, A>,
    onFailure: SyncResult<E2, A>,
  ): SyncResult<E2, A>
} = overload (1, (self, onFailure) =>
  pipe (self, execute, R.match (constant (onFailure), success)),
)

export const catchAll: {
  <E1, E2, A, B>(
    onFailure: (e: E1) => SyncResult<E2, B>,
  ): (self: SyncResult<E1, A>) => SyncResult<E2, A | B>
  <E1, E2, A, B>(
    self: SyncResult<E1, A>,
    onFailure: (e: E1) => SyncResult<E2, B>,
  ): SyncResult<E2, A | B>
} = overload (1, (self, onFailure) =>
  pipe (self, execute, R.match (onFailure, success)),
)

export const Alt: A.Alt<SyncResultHKT> = {
  orElse,
}
