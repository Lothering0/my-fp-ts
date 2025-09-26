import { Sync } from '../modules/Sync'

export const log: {
  <In>(message: In): Sync<void>
} = message => () => console.log(message)

export const info: {
  <In>(message: In): Sync<void>
} = message => () => console.info(message)

export const warn: {
  <In>(message: In): Sync<void>
} = message => () => console.warn(message)

export const error: {
  <In>(message: In): Sync<void>
} = message => () => console.error(message)

export const writeToStdout: {
  (string: string): Sync<void>
} = string => () => process.stdout.write(string)
