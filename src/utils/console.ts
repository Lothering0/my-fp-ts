import { Sync } from "../modules/Sync"

export const log: {
  <A>(a: A): Sync<void>
} = a => () => console.log (a)

export const info: {
  <A>(a: A): Sync<void>
} = a => () => console.info (a)

export const warn: {
  <A>(a: A): Sync<void>
} = a => () => console.warn (a)

export const error: {
  <A>(a: A): Sync<void>
} = a => () => console.error (a)

export const writeToStdout: {
  (s: string): Sync<void>
} = string => () => process.stdout.write (string)
