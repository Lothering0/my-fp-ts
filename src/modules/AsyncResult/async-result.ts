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
import { _AsyncResult } from './internal'

export interface AsyncResultHkt extends Hkt {
  readonly Type: AsyncResult<this['In'], this['Collectable']>
}

export interface AsyncResult<A, E = never>
  extends Async.Async<Result.Result<A, E>> {}

export const fail: {
  <E>(e: E): AsyncResult<never, E>
} = _AsyncResult.fail

export const failSync: {
  <E>(me: Sync.Sync<E>): AsyncResult<never, E>
} = flow(Sync.execute, fail)

export const failAsync: {
  <E>(me: Async.Async<E>): AsyncResult<never, E>
} = _AsyncResult.failKind

export const succeed: {
  <A>(a: A): AsyncResult<A>
} = _AsyncResult.succeed

export const succeedSync: {
  <A>(ma: Sync.Sync<A>): AsyncResult<A>
} = flow(Sync.execute, succeed)

export const succeedAsync: {
  <A>(me: Async.Async<A>): AsyncResult<A>
} = _AsyncResult.succeedKind

export const fromAsync: {
  <A, E>(ma: Async.Async<A>): AsyncResult<A, E>
} = ma => () => ma().then(Result.succeed, Result.fail)

export const fromSyncResult: {
  <A, E>(mma: SyncResult.SyncResult<A, E>): AsyncResult<A, E>
} = mma => () => pipe(mma, SyncResult.execute, ma => Promise.resolve(ma))

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
  <A, E>(ma: AsyncResult<A, E>): Promise<Result.Result<A, E>>
} = mma => mma().then(identity)
