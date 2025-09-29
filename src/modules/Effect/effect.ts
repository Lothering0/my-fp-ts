/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Result from '../Result'
import * as Sync from '../Sync'
import * as Async from '../Async'
import * as AsyncResult from '../AsyncResult'
import * as SyncResult from '../SyncResult'
import { flow, pipe } from '../../utils/flow'
import { Hkt } from '../../typeclasses/Hkt'

export interface EffectHkt extends Hkt {
  readonly Type: Effect<this['In'], this['Collectable']>
}

export type Effect<A, E = never> = SyncEffect<A, E> | AsyncEffect<A, E>

interface SyncEffect<A, E> {
  readonly _id: 'Effect'
  readonly _tag: 'Sync'
  readonly syncResult: SyncResult.SyncResult<A, E>
  readonly [Symbol.iterator]: EffectGenerator<A, E>
}

interface AsyncEffect<A, E> {
  readonly _id: 'Effect'
  readonly _tag: 'Async'
  readonly asyncResult: AsyncResult.AsyncResult<A, E>
  readonly [Symbol.iterator]: EffectGenerator<A, E>
}

export interface EffectGenerator<A, E> {
  (): Generator<E, A>
}

export const fromSyncResult: {
  <A, E>(syncResult: SyncResult.SyncResult<A, E>): Effect<A, E>
} = syncResult => ({
  _id: 'Effect',
  _tag: 'Sync',
  syncResult,
  *[Symbol.iterator]() {
    const result = yield* pipe(syncResult, SyncResult.execute)
    return result
  },
})

export const fromSync: {
  <A>(sync: Sync.Sync<A>): Effect<A>
} = flow(Sync.map(Result.succeed), fromSyncResult)

export const fromAsyncResult: {
  <A, E>(asyncResult: AsyncResult.AsyncResult<A, E>): Effect<A, E>
} = asyncResult => ({
  _id: 'Effect',
  _tag: 'Async',
  asyncResult,
  *[Symbol.iterator]() {
    const result = yield pipe(asyncResult, AsyncResult.toPromise) as any
    return result as any
  },
})

export const fromAsync: {
  <A>(async: Async.Async<A>): Effect<A>
} = flow(Async.map(Result.succeed), fromAsyncResult)

export const fromResult: {
  <A, E>(result: Result.Result<A, E>): Effect<A, E>
} = result => fromSyncResult(() => result)

export const succeed: {
  <A>(a: A): Effect<A>
} = flow(SyncResult.succeed, fromSyncResult)

export const fail: {
  <E>(e: E): Effect<never, E>
} = flow(SyncResult.fail, fromSyncResult)

export const run: {
  (self: Effect<unknown, unknown>): void
} = self => {
  if (self._tag === 'Sync') {
    pipe(self.syncResult, SyncResult.execute)
  } else {
    pipe(self.asyncResult, AsyncResult.toPromise)
  }
}

export const toPromise: {
  <A, E>(self: Effect<A, E>): Promise<Result.Result<A, E>>
} = self => {
  if (self._tag === 'Sync') {
    return pipe(self.syncResult, SyncResult.execute, a => Promise.resolve(a))
  }

  return pipe(self.asyncResult, AsyncResult.toPromise)
}

export const gen = <A, E>(generator: EffectGenerator<A, E>): Effect<A, E> => {
  const iterator = generator()
  let { value, done } = iterator.next()

  if (!(value instanceof Promise)) {
    return done ? succeed(value as A) : fail(value as E)
  }

  const promise: Promise<Result.Result<A, E>> = value

  const nextIteration = async (promise: Promise<Result.Result<A, E>>) => {
    const ma = await promise

    if (Result.isFailure(ma)) {
      return ma
    }

    if (!done) {
      const iterationResult = iterator.next(Result.successOf(ma))
      value = iterationResult.value
      done = iterationResult.done
      return nextIteration(Promise.resolve(value) as any)
    }

    return Result.succeed(value)
  }

  return pipe(() => nextIteration(promise), fromAsyncResult<A, E>)
}
