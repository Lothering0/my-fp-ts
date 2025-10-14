import * as Result from '../Result'
import * as Sync from '../Sync'
import { Hkt } from '../../typeclasses/Hkt'
import { pipe } from '../../utils/flow'
import { TryCatch } from '../../types/TryCatch'
import { UnknownException } from '../Exception'
import { isFunction } from '../../utils/typeChecks'
import { _SyncResult } from './internal'

export interface SyncResultHkt extends Hkt {
  readonly Type: SyncResult<this['In'], this['Collectable']>
}

export interface SyncResult<A, E = never>
  extends Sync.Sync<Result.Result<A, E>> {}

export const fail: {
  <E>(e: E): SyncResult<never, E>
} = _SyncResult.fail

export const failSync: {
  <E>(me: Sync.Sync<E>): SyncResult<never, E>
} = _SyncResult.failKind

export const succeed: {
  <A>(a: A): SyncResult<A>
} = _SyncResult.succeed

export const succeedSync: {
  <A>(ma: Sync.Sync<A>): SyncResult<A>
} = _SyncResult.succeedKind

export const fromSync: {
  <A, E>(ma: Sync.Sync<A>): SyncResult<A, E>
} = ma => () => Result.succeed(ma())

const try_: {
  <A, E>(tryCatch: TryCatch<A, E>): SyncResult<A, E>
  <A>(operation: () => A): SyncResult<A, UnknownException>
} =
  <A, E>(operationOrTryCatch: TryCatch<A, E> | (() => A)): SyncResult<A, E> =>
  () => {
    let tryCatch: TryCatch<A, E>

    if (isFunction(operationOrTryCatch)) {
      tryCatch = {
        try: operationOrTryCatch,
        catch: e => new UnknownException(e) as E,
      }
    } else {
      tryCatch = operationOrTryCatch
    }

    try {
      return Result.succeed(tryCatch.try())
    } catch (e) {
      return pipe(e, tryCatch.catch, Result.fail)
    }
  }

export { try_ as try }

export const execute: {
  <A, E>(ma: SyncResult<A, E>): Result.Result<A, E>
} = ma => ma()
