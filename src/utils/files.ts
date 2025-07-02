import * as fs from "node:fs"
import * as fsPromises from "node:fs/promises"
import * as IoE from "../modules/IoEither"
import * as TE from "../modules/TaskEither"

export const readFileSync: {
  (path: string): IoE.IoEither<unknown, Buffer>
} = path => IoE.toIoEither (() => fs.readFileSync (path))

export const readFile: {
  (path: string): TE.TaskEither<unknown, Buffer>
} = path => TE.toTaskEither (() => fsPromises.readFile (path))
