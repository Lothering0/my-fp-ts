import * as Result from '../Result'
import * as Sync from '../Sync'
import { Hkt } from '../../typeclasses/Hkt'
import { pipe } from '../../utils/flow'
import { tryDo } from '../../utils/exceptions'

export interface SyncResultHkt extends Hkt {
  readonly Type: SyncResult<this['Collectable'], this['In']>
}

export interface SyncResult<E, A> extends Sync.Sync<Result.Result<E, A>> {}

export const fail: {
  <E>(e: E): SyncResult<E, never>
} = e => () => Result.fail(e)

export const failSync: {
  <E>(me: Sync.Sync<E>): SyncResult<E, never>
} = me => () => pipe(me, Sync.execute, Result.fail)

export const succeed: {
  <A>(a: A): SyncResult<never, A>
} = a => () => Result.succeed(a)

export const succeedSync: {
  <A>(ma: Sync.Sync<A>): SyncResult<never, A>
} = ma => () => pipe(ma, Sync.execute, Result.succeed)

export const fromSync: {
  <E, A>(ma: Sync.Sync<A>): SyncResult<E, A>
} = ma => () => tryDo(ma)

export const fromResult: {
  <E, A>(result: Result.Result<E, A>): SyncResult<E, A>
} = Sync.of

export const execute: {
  <E, A>(ma: SyncResult<E, A>): Result.Result<E, A>
} = ma => {
  try {
    return ma()
  } catch (exception) {
    return Result.fail(exception)
  }
}
