import * as alt from "../../typeclasses/Alt"
import * as result from "../Result"
import { Sync } from "../Sync"
import { identity } from "../Identity"
import { SyncResult, SyncResultHkt, execute, succeed } from "./sync-result"
import { match } from "./matchers"
import { constant } from "../../utils/constant"
import { flow } from "../../utils/flow"

export const getOrElse: {
  <E, B>(onFailure: (e: E) => B): <A>(self: SyncResult<E, A>) => Sync<A | B>
} = onFailure => match ({ onFailure, onSuccess: identity })

export const orElse: {
  <E1, A>(
    onFailure: SyncResult<E1, A>,
  ): <E2, B>(self: SyncResult<E2, B>) => SyncResult<E1 | E2, A | B>
} = onFailure =>
  flow (
    execute,
    result.match ({
      onFailure: constant (onFailure),
      onSuccess: succeed,
    }),
  )

export const catchAll: {
  <E1, E2, B>(
    onFailure: (e: E1) => SyncResult<E2, B>,
  ): <A>(self: SyncResult<E1, A>) => SyncResult<E2, A | B>
} = onFailure =>
  flow (
    execute,
    result.match ({
      onFailure,
      onSuccess: succeed,
    }),
  )

export const Alt: alt.Alt<SyncResultHkt> = {
  orElse,
}
