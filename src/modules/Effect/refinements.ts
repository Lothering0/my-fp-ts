import { isRecord } from '../../utils/typeChecks'
import * as Effect from './effect'

export const isEffect = (x: unknown): x is Effect.Effect<unknown, unknown> =>
  isRecord(x) && x?._id === 'Effect'
