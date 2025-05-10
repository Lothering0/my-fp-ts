import { IO } from "../modules/io"

type Log_ = (a: unknown) => IO<void>
export const log_: Log_ = a => () => console.log (a)

type Info_ = (a: unknown) => IO<void>
export const info_: Info_ = a => () => console.info (a)

type Warn_ = (a: unknown) => IO<void>
export const warn_: Warn_ = a => () => console.warn (a)

type Error_ = (a: unknown) => IO<void>
export const error_: Error_ = a => () => console.error (a)

type WriteToStdout_ = (a: string) => IO<void>
export const writeToStdout_: WriteToStdout_ = string => () =>
  process.stdout.write (string)
