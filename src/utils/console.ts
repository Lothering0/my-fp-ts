import { Io } from "../modules/Io"

export const log_: {
  <A>(a: A): Io<void>
} = a => () => console.log (a)

export const info_: {
  <A>(a: A): Io<void>
} = a => () => console.info (a)

export const warn_: {
  <A>(a: A): Io<void>
} = a => () => console.warn (a)

export const error_: {
  <A>(a: A): Io<void>
} = a => () => console.error (a)

export const writeToStdout_: {
  (s: string): Io<void>
} = string => () => process.stdout.write (string)
