import { Sync } from "../modules/Sync"

export const log_: {
  <A>(a: A): Sync<void>
} = a => () => console.log (a)

export const info_: {
  <A>(a: A): Sync<void>
} = a => () => console.info (a)

export const warn_: {
  <A>(a: A): Sync<void>
} = a => () => console.warn (a)

export const error_: {
  <A>(a: A): Sync<void>
} = a => () => console.error (a)

export const writeToStdout_: {
  (s: string): Sync<void>
} = string => () => process.stdout.write (string)
