import { isRecord } from '../../utils/typeChecks'
import * as Effect from './effect'

export const isEffect = (x: unknown): x is Effect.Effect<unknown, unknown> =>
  isRecord(x) && x?._id === 'Effect'

export const isSync: {
  <A, E>(self: Effect.Effect<A, E>): self is Effect.SyncEffect<A, E>
} = self => self._tag === 'Sync'

export const isAsync: {
  <A, E>(self: Effect.Effect<A, E>): self is Effect.AsyncEffect<A, E>
} = self => self._tag === 'Async'
