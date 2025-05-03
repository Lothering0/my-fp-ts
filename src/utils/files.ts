import * as fs from "node:fs"
import * as fsPromises from "node:fs/promises"
import * as IOE from "../modules/io-either"
import * as TE from "../modules/task-either"

type ReadFileSync = (a: string) => IOE.IOEither<unknown, Buffer>
export const readFileSync: ReadFileSync = path =>
  IOE.toTaskEither (() => fs.readFileSync (path))

type ReadFile = (a: string) => TE.TaskEither<unknown, Buffer>
export const readFile: ReadFile = path =>
  TE.toTaskEither (() => fsPromises.readFile (path))
