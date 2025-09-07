import * as result from "../Result"
import * as sync from "../Sync"
import { flow } from "../../utils/flow"
import { execute, SyncResult } from "./sync-result"

export const match: {
  <E, A, B, C = B>(
    matchers: result.Matchers<E, A, B, C>,
  ): (self: SyncResult<E, A>) => sync.Sync<B | C>
} = matchers => flow (execute, result.match (matchers), sync.of)
