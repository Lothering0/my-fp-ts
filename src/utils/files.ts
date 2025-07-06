import * as fs from "node:fs"
import * as fsPromises from "node:fs/promises"
import * as SR from "../modules/SyncResult"
import * as AR from "../modules/AsyncResult"

export const readFileSync: {
  (path: string): SR.SyncResult<unknown, Buffer>
} = path => SR.toSyncResult (() => fs.readFileSync (path))

export const readFile: {
  (path: string): AR.AsyncResult<unknown, Buffer>
} = path => AR.toAsyncResult (() => fsPromises.readFile (path))
