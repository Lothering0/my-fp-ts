import * as alt from "../../typeclasses/Alt"
import * as result from "../Result"
import { Sync } from "../Sync"
import { identity } from "../Identity"
import { SyncResult, SyncResultHkt, execute, succeed } from "./sync-result"
import { match } from "./matchers"
import { constant } from "../../utils/constant"
import { flow } from "../../utils/flow"

export const getOrElse: {
  <Collectable, Out>(
    onFailure: (e: Collectable) => Out,
  ): <In>(self: SyncResult<Collectable, In>) => Sync<In | Out>
} = onFailure => match ({ onFailure, onSuccess: identity })

export const orElse: {
  <Collectable1, Out>(
    onFailure: SyncResult<Collectable1, Out>,
  ): <Collectable2, In>(
    self: SyncResult<Collectable2, In>,
  ) => SyncResult<Collectable1 | Collectable2, In | Out>
} = onFailure =>
  flow (
    execute,
    result.match ({
      onFailure: constant (onFailure),
      onSuccess: succeed,
    }),
  )

export const catchAll: {
  <Collectable1, Collectable2, Out>(
    onFailure: (e: Collectable1) => SyncResult<Collectable2, Out>,
  ): <In>(
    self: SyncResult<Collectable1, In>,
  ) => SyncResult<Collectable2, In | Out>
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
