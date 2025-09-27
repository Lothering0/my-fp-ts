import * as fs from 'node:fs'
import * as fsPromises from 'node:fs/promises'
import * as SyncResult from '../modules/SyncResult'
import * as AsyncResult from '../modules/AsyncResult'

export const readFileSync: {
  (path: string): SyncResult.SyncResult<Buffer, Error>
} = path => SyncResult.fromSync(() => fs.readFileSync(path))

export const readFile: {
  (path: string): AsyncResult.AsyncResult<Buffer, Error>
} = path => AsyncResult.fromAsync(() => fsPromises.readFile(path))
