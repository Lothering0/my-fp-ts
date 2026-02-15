import * as Async from '../Async'
import * as Result from '../Result'
import * as Sync from '../Sync'
import * as SyncResult from '../SyncResult'
import { identity } from '../Identity'
import { flow, pipe } from '../../utils/flow'
import { Hkt } from '../../typeclasses/Hkt'
import { TryCatch } from '../../types/TryCatch'
import { UnknownException } from '../Exception'
import { isFunction } from '../../utils/typeChecks'
import { _AsyncResult } from './_internal'

export interface AsyncResultHkt extends Hkt {
  readonly Type: AsyncResult<this['In'], this['Collectable']>
}

export interface AsyncResult<A, E = never>
  extends Async.Async<Result.Result<A, E>> {}

export interface AsyncResultGenerator<A, E = never> {
  (
    make: <B, D>(asyncResult: AsyncResult<B, D>) => AsyncResultIterable<B, D>,
  ): Generator<E, A>
}

export interface AsyncResultIterable<A, E = never> {
  readonly [Symbol.iterator]: Result.ResultGenerator<A, E>
}

export const fail: {
  <E>(e: E): AsyncResult<never, E>
} = _AsyncResult.fail

export const failSync: {
  <E>(sync: Sync.Sync<E>): AsyncResult<never, E>
} = flow(Sync.run, fail)

export const failAsync: {
  <E>(async: Async.Async<E>): AsyncResult<never, E>
} = _AsyncResult.failKind

export const succeed: {
  <A>(a: A): AsyncResult<A>
} = _AsyncResult.succeed

export const succeedSync: {
  <A>(sync: Sync.Sync<A>): AsyncResult<A>
} = flow(Sync.run, succeed)

export const succeedAsync: {
  <A>(async: Async.Async<A>): AsyncResult<A>
} = _AsyncResult.succeedKind

export const fromAsync: {
  <A, E>(async: Async.Async<A>): AsyncResult<A, E>
} = async => () => async().then(Result.succeed, Result.fail)

export const fromSyncResult: {
  <A, E>(syncResult: SyncResult.SyncResult<A, E>): AsyncResult<A, E>
} = syncResult => () =>
  pipe(syncResult, SyncResult.run, ma => Promise.resolve(ma))

const try_: {
  <A, E>(tryCatch: TryCatch<Promise<A>, E>): AsyncResult<A, E>
  <A>(operation: () => Promise<A>): AsyncResult<A, UnknownException>
} =
  <A, E>(
    operationOrTryCatch: TryCatch<Promise<A>, E> | (() => Promise<A>),
  ): AsyncResult<A, E> =>
  () => {
    let tryCatch: TryCatch<Promise<A>, E>

    if (isFunction(operationOrTryCatch)) {
      tryCatch = {
        try: operationOrTryCatch,
        catch: e => new UnknownException(e) as E,
      }
    } else {
      tryCatch = operationOrTryCatch
    }

    try {
      return tryCatch
        .try()
        .then(Result.succeed)
        .catch(flow(tryCatch.catch, Result.fail))
    } catch (e) {
      return pipe(e, tryCatch.catch, Result.fail, e => Promise.resolve(e))
    }
  }

export { try_ as try }

export const toPromise: {
  <A, E>(asyncResult: AsyncResult<A, E>): Promise<Result.Result<A, E>>
} = asyncResult => asyncResult().then(identity)

/** Alias for `toPromise` */
export const run = toPromise

const makeIterable: {
  <A, E>(asyncResult: AsyncResult<A, E>): AsyncResultIterable<A, E>
} = asyncResult => ({
  *[Symbol.iterator]() {
    const result = yield asyncResult() as any
    return result as any
  },
})

export const gen =
  <A, E>(generator: AsyncResultGenerator<A, E>): AsyncResult<A, E> =>
  () => {
    const iterator = generator(makeIterable)
    let { value, done } = iterator.next()

    const promise = value as Promise<Result.Result<A, E>>

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

      return Result.succeed(value as A)
    }

    return nextIteration(promise)
  }
