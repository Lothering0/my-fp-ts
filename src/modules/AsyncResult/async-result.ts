import * as Async from '../Async'
import * as Result from '../Result'
import * as Sync from '../Sync'
import * as SyncResult from '../SyncResult'
import { identity } from '../Identity'
import { flow, pipe } from '../../utils/flow'
import { Hkt } from '../../typeclasses/Hkt'

export interface AsyncResultHkt extends Hkt {
  readonly Type: AsyncResult<this['In'], this['Collectable']>
}

export interface AsyncResult<A, E = never>
  extends Async.Async<Result.Result<A, E>> {}

export const fail: {
  <E>(e: E): AsyncResult<never, E>
} = flow(Result.fail, Async.of)

export const failSync: {
  <E>(me: Sync.Sync<E>): AsyncResult<never, E>
} = flow(Sync.execute, fail)

export const failAsync: {
  <E>(me: Async.Async<E>): AsyncResult<never, E>
} = Async.map(Result.fail)

export const succeed: {
  <A>(a: A): AsyncResult<A>
} = flow(Result.succeed, Async.of)

export const succeedSync: {
  <A>(ma: Sync.Sync<A>): AsyncResult<A>
} = flow(Sync.execute, succeed)

export const succeedAsync: {
  <A>(me: Async.Async<A>): AsyncResult<A>
} = Async.map(Result.succeed)

export const fromAsync: {
  <A, E>(ma: Async.Async<A>): AsyncResult<A, E>
} = ma => () => ma().then(Result.succeed, Result.fail)

export const fromResult: {
  <A, E>(ma: Result.Result<A, E>): AsyncResult<A, E>
} = Async.of

export const fromSyncResult: {
  <A, E>(mma: SyncResult.SyncResult<A, E>): AsyncResult<A, E>
} = mma => () => pipe(mma, SyncResult.execute, ma => Promise.resolve(ma))

export const toPromise: {
  <A, E>(ma: AsyncResult<A, E>): Promise<Result.Result<A, E>>
} = mma => mma().then(identity, Result.fail)
