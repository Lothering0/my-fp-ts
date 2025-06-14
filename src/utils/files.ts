import * as fs from "node:fs"
import * as fsPromises from "node:fs/promises"
import * as IoE from "../modules/IoEither"
import * as TE from "../modules/TaskEither"

type ReadFileSync = (a: string) => IoE.IoEither<unknown, Buffer>
export const readFileSync: ReadFileSync = path =>
  IoE.toIoEither (() => fs.readFileSync (path))

type ReadFile = (a: string) => TE.TaskEither<unknown, Buffer>
export const readFile: ReadFile = path =>
  TE.toTaskEither (() => fsPromises.readFile (path))
