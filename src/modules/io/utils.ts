import * as fs from "node:fs"
import { fromIo, io, IO } from "./io"
import * as O from "../option"
import * as E from "../either"
import { _, compose } from "../../utils"

type TryDo = <E, A>(f: () => A) => E.Either<E, A>
export const tryDo: TryDo = <E, A>(f: () => A) => {
  try {
    return E.right (f ())
  } catch (exception) {
    return E.left (exception as E)
  }
}

type Log = (a: unknown) => IO<void>
export const log: Log = compose (io, console.log)

type Now = () => IO<number>
export const now: Now = compose<void, number, IO<number>> (io, Date.now)

type DoWhile = <A>(f: () => boolean) => (g: () => A) => IO<void>
export const doWhile: DoWhile = p => f => {
  while (p ()) f ()
  return io (_)
}

type WaitSync = (a: number) => IO<void>
export const waitSync: WaitSync = ms => {
  const start = fromIo (now ())
  type Predicate = () => boolean
  const predicate: Predicate = () => fromIo (now ()) - start < ms

  return doWhile (predicate) (() => _)
}

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
