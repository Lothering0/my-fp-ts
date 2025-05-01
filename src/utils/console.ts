import { _ } from "./underscore"
import { constant } from "./constant"
import { io, IO } from "../modules/io"
import { compose } from "../modules/identity"

type Log_ = (a: unknown) => IO<void>
export const log_: Log_ = compose (io, console.log)

type Info_ = (a: unknown) => IO<void>
export const info_: Info_ = compose (io, console.info)

type Warn_ = (a: unknown) => IO<void>
export const warn_: Warn_ = compose (io, console.warn)

type Error_ = (a: unknown) => IO<void>
export const error_: Error_ = compose (io, console.error)

type WriteToStdout_ = (a: string) => IO<void>
export const writeToStdout_: WriteToStdout_ = compose (constant (io (_)), string =>
  process.stdout.write (string),
)
