import * as Result from '../Result'
import * as Effect from './effect'
import { isFunction } from '../../utils/typeChecks'
import { identity } from '../Identity'
import { flow, pipe } from '../../utils/flow'
import { mapResult } from './functor'

export interface TryCatch<A, E> {
  readonly try: () => A
  readonly catch: (e: unknown) => E
}

const try_: {
  <A, E>(tryCatch: TryCatch<A, E>): Effect.Effect<Awaited<A>, E>
  <A>(operation: () => A): Effect.Effect<Awaited<A>, unknown>
} = <A, E>(
  operationOrTryCatch: TryCatch<A, E> | (() => A),
): Effect.Effect<A, E> => {
  let tryCatch: TryCatch<A, E>

  if (isFunction(operationOrTryCatch)) {
    tryCatch = {
      try: operationOrTryCatch,
      catch: identity<E>,
    }
  } else {
    tryCatch = operationOrTryCatch
  }

  try {
    const result = tryCatch.try()
    if (result instanceof Promise) {
      return Effect.fromAsyncResult(() =>
        result.then(Result.succeed, flow(tryCatch.catch, Result.fail)),
      )
    }
    return Effect.succeed(result)
  } catch (e) {
    return pipe(e, tryCatch.catch, Effect.fail)
  }
}

export { try_ as try }

export const toUnion: {
  <A, E>(self: Effect.Effect<A, E>): Effect.Effect<A | E>
} = mapResult(flow(Result.toUnion, Result.succeed))

export const swap: {
  <A, E>(self: Effect.Effect<A, E>): Effect.Effect<E, A>
} = mapResult(Result.swap)
