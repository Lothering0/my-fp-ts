import * as fs from "node:fs"
import { io, IO } from "../io"
import * as O from "../../option"
import * as E from "../../either"
import { tryDo } from "./exceptions"

type UnsafeReadFileSync = (a: string) => IO<string>
export const unsafeReadFileSync: UnsafeReadFileSync = path =>
  io (fs.readFileSync (path).toString ())

type ReadFileSync = (a: string) => IO<O.Option<string>>
export const readFileSync: ReadFileSync = path =>
  io (
    E.either (
      tryDo (() => fs.readFileSync (path)),
      () => O.none,
      x => O.some (x.toString ()),
    ),
  )
