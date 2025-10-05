import * as Effect from '../modules/Effect'

export const log: {
  <In>(message: In): Effect.Effect<void>
} = message => Effect.fromSync(() => console.log(message))

export const info: {
  <In>(message: In): Effect.Effect<void>
} = message => Effect.fromSync(() => console.info(message))

export const warn: {
  <In>(message: In): Effect.Effect<void>
} = message => Effect.fromSync(() => console.warn(message))

export const error: {
  <In>(message: In): Effect.Effect<void>
} = message => Effect.fromSync(() => console.error(message))

export const writeToStdout: {
  (string: string): Effect.Effect<boolean>
} = string => Effect.fromSync(() => process.stdout.write(string))
