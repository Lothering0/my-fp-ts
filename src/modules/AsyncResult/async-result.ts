import * as async from '../Async'
import * as result from '../Result'
import * as sync from '../Sync'
import * as syncResult from '../SyncResult'
import { identity } from '../Identity'
import { flow, pipe } from '../../utils/flow'
import { Hkt } from '../../typeclasses/Hkt'

export interface AsyncResultHkt extends Hkt {
  readonly Type: AsyncResult<this['Collectable'], this['In']>
}

export interface AsyncResult<E, A> extends async.Async<result.Result<E, A>> {}

export const fail: {
  <Failure>(e: Failure): AsyncResult<Failure, never>
} = flow(result.fail, async.of)

export const failSync: {
  <Failure>(me: sync.Sync<Failure>): AsyncResult<Failure, never>
} = flow(sync.execute, fail)

export const failAsync: {
  <Failure>(me: async.Async<Failure>): AsyncResult<Failure, never>
} = async.map(result.fail)

export const succeed: {
  <Success>(a: Success): AsyncResult<never, Success>
} = flow(result.succeed, async.of)

export const succeedSync: {
  <Success>(ma: sync.Sync<Success>): AsyncResult<never, Success>
} = flow(sync.execute, succeed)

export const succeedAsync: {
  <Success>(me: async.Async<Success>): AsyncResult<never, Success>
} = async.map(result.succeed)

export const fromAsync: {
  <Failure, Success>(ma: async.Async<Success>): AsyncResult<Failure, Success>
} = ma => () => ma().then(result.succeed, result.fail)

export const fromResult: {
  <Failure, Success>(
    ma: result.Result<Failure, Success>,
  ): AsyncResult<Failure, Success>
} = async.of

export const fromSyncResult: {
  <Failure, Success>(
    mma: syncResult.SyncResult<Failure, Success>,
  ): AsyncResult<Failure, Success>
} = mma => () => pipe(mma, syncResult.execute, ma => Promise.resolve(ma))

export const toPromise: {
  <Failure, Success>(
    ma: AsyncResult<Failure, Success>,
  ): Promise<result.Result<Failure, Success>>
} = mma => mma().then(identity, result.fail)
