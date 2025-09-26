import * as fs from 'node:fs'
import * as fsPromises from 'node:fs/promises'
import * as syncResult from '../modules/SyncResult'
import * as asyncResult from '../modules/AsyncResult'

export const readFileSync: {
  (path: string): syncResult.SyncResult<Error, Buffer>
} = path => syncResult.fromSync(() => fs.readFileSync(path))

export const readFile: {
  (path: string): asyncResult.AsyncResult<Error, Buffer>
} = path => asyncResult.fromAsync(() => fsPromises.readFile(path))
