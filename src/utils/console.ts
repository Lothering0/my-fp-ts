import { Io } from "../modules/Io"

type Log_ = (a: unknown) => Io<void>
export const log_: Log_ = a => () => console.log (a)

type Info_ = (a: unknown) => Io<void>
export const info_: Info_ = a => () => console.info (a)

type Warn_ = (a: unknown) => Io<void>
export const warn_: Warn_ = a => () => console.warn (a)

type Error_ = (a: unknown) => Io<void>
export const error_: Error_ = a => () => console.error (a)

type WriteToStdout_ = (a: string) => Io<void>
export const writeToStdout_: WriteToStdout_ = string => () =>
  process.stdout.write (string)
