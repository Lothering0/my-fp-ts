import * as fs from "node:fs"
import * as fsPromises from "node:fs/promises"
import * as IO from "../modules/io"
import * as O from "../modules/option"
import * as E from "../modules/either"
import * as T from "../modules/task"
import { tryDo } from "./exceptions"

type UnsafeReadFileSync = (a: string) => IO.IO<string>
export const unsafeReadFileSync: UnsafeReadFileSync = path =>
  IO.pure (fs.readFileSync (path).toString ())

type ReadFileSync = (a: string) => IO.IO<O.Option<string>>
export const readFileSync: ReadFileSync = path =>
  IO.pure (
    E.either (
      tryDo (() => fs.readFileSync (path)),
      () => O.none,
      x => O.some (x.toString ()),
    ),
  )

type ReadFile = (a: string) => T.Task<O.Option<string>>
export const readFile: ReadFile = path => () =>
  E.either (
    tryDo (() => fsPromises.readFile (path)),
    () => O.none,
    x => O.some (x.toString ()),
  )
