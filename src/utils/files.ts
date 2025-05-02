import * as fs from "node:fs"
import * as fsPromises from "node:fs/promises"
import * as IO from "../modules/io"
import * as E from "../modules/either"
import * as TE from "../modules/task-either"
import { tryDo } from "./exceptions"

type ReadFileSync = (a: string) => IO.IO<E.Either<unknown, Buffer>>
export const readFileSync: ReadFileSync = path =>
  IO.pure (tryDo (() => fs.readFileSync (path)))

type ReadFile = (a: string) => TE.TaskEither<unknown, Buffer>
export const readFile: ReadFile = path =>
  TE.toTaskEither (() => fsPromises.readFile (path))
