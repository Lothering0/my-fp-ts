import * as Async from '../Async'
import * as Result from '../Result'
import * as Sync from '../Sync'
import * as SyncResult from '../SyncResult'
import { identity } from '../Identity'
import { flow, pipe } from '../../utils/flow'
import { Hkt } from '../../typeclasses/Hkt'

export interface AsyncResultHkt extends Hkt {
  readonly Type: AsyncResult<this['Collectable'], this['In']>
}

export interface AsyncResult<E, A> extends Async.Async<Result.Result<E, A>> {}

export const fail: {
  <Failure>(e: Failure): AsyncResult<Failure, never>
} = flow(Result.fail, Async.of)

export const failSync: {
  <Failure>(me: Sync.Sync<Failure>): AsyncResult<Failure, never>
} = flow(Sync.execute, fail)

export const failAsync: {
  <Failure>(me: Async.Async<Failure>): AsyncResult<Failure, never>
} = Async.map(Result.fail)

export const succeed: {
  <Success>(a: Success): AsyncResult<never, Success>
} = flow(Result.succeed, Async.of)

export const succeedSync: {
  <Success>(ma: Sync.Sync<Success>): AsyncResult<never, Success>
} = flow(Sync.execute, succeed)

export const succeedAsync: {
  <Success>(me: Async.Async<Success>): AsyncResult<never, Success>
} = Async.map(Result.succeed)

export const fromAsync: {
  <Failure, Success>(ma: Async.Async<Success>): AsyncResult<Failure, Success>
} = ma => () => ma().then(Result.succeed, Result.fail)

export const fromResult: {
  <Failure, Success>(
    ma: Result.Result<Failure, Success>,
  ): AsyncResult<Failure, Success>
} = Async.of

export const fromSyncResult: {
  <Failure, Success>(
    mma: SyncResult.SyncResult<Failure, Success>,
  ): AsyncResult<Failure, Success>
} = mma => () => pipe(mma, SyncResult.execute, ma => Promise.resolve(ma))

export const toPromise: {
  <Failure, Success>(
    ma: AsyncResult<Failure, Success>,
  ): Promise<Result.Result<Failure, Success>>
} = mma => mma().then(identity, Result.fail)
