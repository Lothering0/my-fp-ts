import * as alt from "../../types/Alt"
import * as result from "../Result"
import { Sync } from "../Sync"
import { identity } from "../Identity"
import { SyncResult, SyncResultHKT, execute, success } from "./sync-result"
import { match } from "./utils"
import { constant } from "../../utils/constant"
import { flow } from "../../utils/flow"

export const getOrElse: {
  <E, B>(onFailure: (e: E) => B): <A>(self: SyncResult<E, A>) => Sync<A | B>
} = onFailure => match (onFailure, identity)

export const orElse: {
  <E1, A>(
    onFailure: SyncResult<E1, A>,
  ): <E2, B>(self: SyncResult<E2, B>) => SyncResult<E1 | E2, A | B>
} = onFailure => flow (execute, result.match (constant (onFailure), success))

export const catchAll: {
  <E1, E2, B>(
    onFailure: (e: E1) => SyncResult<E2, B>,
  ): <A>(self: SyncResult<E1, A>) => SyncResult<E2, A | B>
} = onFailure => flow (execute, result.match (onFailure, success))

export const Alt: alt.Alt<SyncResultHKT> = {
  orElse,
}
