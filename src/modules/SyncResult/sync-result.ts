import * as Result from '../Result'
import * as Sync from '../Sync'
import { Hkt } from '../../typeclasses/Hkt'
import { pipe } from '../../utils/flow'
import { tryDo } from '../../utils/exceptions'

export interface SyncResultHkt extends Hkt {
  readonly Type: SyncResult<this['In'], this['Collectable']>
}

export interface SyncResult<A, E = never>
  extends Sync.Sync<Result.Result<A, E>> {}

export const fail: {
  <E>(e: E): SyncResult<never, E>
} = e => () => Result.fail(e)

export const failSync: {
  <E>(me: Sync.Sync<E>): SyncResult<never, E>
} = me => () => pipe(me, Sync.execute, Result.fail)

export const succeed: {
  <A>(a: A): SyncResult<A>
} = a => () => Result.succeed(a)

export const succeedSync: {
  <A>(ma: Sync.Sync<A>): SyncResult<A>
} = ma => () => pipe(ma, Sync.execute, Result.succeed)

export const fromSync: {
  <A, E>(ma: Sync.Sync<A>): SyncResult<A, E>
} = ma => () => tryDo(ma)

export const fromResult: {
  <A, E>(result: Result.Result<A, E>): SyncResult<A, E>
} = Sync.of

export const execute: {
  <A, E>(ma: SyncResult<A, E>): Result.Result<A, E>
} = ma => {
  try {
    return ma()
  } catch (exception) {
    return Result.fail(exception)
  }
}
