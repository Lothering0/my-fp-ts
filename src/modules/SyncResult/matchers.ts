import * as result from "../Result"
import * as sync from "../Sync"
import { flow } from "../../utils/flow"
import { execute, SyncResult } from "./sync-result"

export const match: {
  <Failure, In, Out1, Out2 = Out1>(
    matchers: result.Matchers<Failure, In, Out1, Out2>,
  ): (self: SyncResult<Failure, In>) => sync.Sync<Out1 | Out2>
} = matchers => flow (execute, result.match (matchers), sync.of)
