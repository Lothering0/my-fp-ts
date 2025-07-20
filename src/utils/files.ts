import * as fs from "node:fs"
import * as fsPromises from "node:fs/promises"
import * as SR from "../modules/SyncResult"
import * as AR from "../modules/AsyncResult"

export const readFileSync: {
  (path: string): SR.SyncResult<Error, Buffer>
} = path => SR.fromSync (() => fs.readFileSync (path))

export const readFile: {
  (path: string): AR.AsyncResult<Error, Buffer>
} = path => AR.fromAsync (() => fsPromises.readFile (path))
