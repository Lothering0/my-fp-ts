/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Result from '../Result'
import * as Sync from '../Sync'
import * as Async from '../Async'
import * as AsyncResult from '../AsyncResult'
import * as SyncResult from '../SyncResult'
import { flow } from '../../utils/flow'
import { Hkt } from '../../typeclasses/Hkt'
import { TaggedTypeError } from '../Exception'
import { _run, create } from './_internal'

export interface EffectHkt extends Hkt {
  readonly Type: Effect<this['In'], this['Collectable']>
}

export interface Effect<A, E = never> {
  readonly _id: 'Effect'
  readonly mapper: (
    result?: Result.Result<unknown, unknown>,
  ) => EffectValue<A, E>
  // Using chain of effects to avoid potential call stack overflows
  readonly previous: Effect<unknown, unknown> | undefined
  readonly [Symbol.iterator]: EffectGenerator<A, E>
}

export interface EffectGenerator<A, E = never> {
  (): Generator<E, A>
}

export type EffectValue<A, E = never> =
  | Result.Result<A, E>
  | Promise<Result.Result<A, E>>

export interface EffectOperation<A, E = never> {
  (): EffectValue<A, E>
}

export class AsyncEffectException extends TaggedTypeError(
  'AsyncEffectException',
) {}

export class SyncEffectException extends TaggedTypeError(
  'SyncEffectException',
) {}

export const run: {
  <A, E>(effect: Effect<A, E>): EffectValue<A, E>
} = effect => _run(effect)

/** Throws an error when `Effect` instance starts to run asynchronously */
export const runSync: {
  <A, E>(effect: Effect<A, E>): Result.Result<A, E>
} = effect => _run(effect, 'sync')

/** Throws an error if `Effect` instance don't returned a `Promise` */
export const runAsync: {
  <A, E>(effect: Effect<A, E>): Promise<Result.Result<A, E>>
} = effect => _run(effect, 'async')

export const toPromise: {
  <A, E>(effect: Effect<A, E>): Promise<Result.Result<A, E>>
} = effect => Promise.resolve(_run(effect))

export const fromOperation: {
  <A, E>(operation: () => EffectValue<A, E>): Effect<A, E>
} = operation => create(operation)

export const succeed: {
  <A>(a: A): Effect<A>
} = a => create(() => Result.succeed(a))

export const fail: {
  <E>(e: E): Effect<never, E>
} = e => create(() => Result.fail(e))

export const fromSyncResult: {
  <A, E>(syncResult: SyncResult.SyncResult<A, E>): Effect<A, E>
} = fromOperation

export const fromSync: {
  <A>(sync: Sync.Sync<A>): Effect<A>
} = flow(Sync.map(Result.succeed), fromSyncResult)

export const fromAsyncResult: {
  <A, E>(asyncResult: AsyncResult.AsyncResult<A, E>): Effect<A, E>
} = fromOperation

export const fromAsync: {
  <A>(async: Async.Async<A>): Effect<A>
} = flow(Async.map(Result.succeed), fromAsyncResult)

export const gen = <A, E>(generator: EffectGenerator<A, E>): Effect<A, E> =>
  fromOperation(() => {
    const iterator = generator()
    let { value, done } = iterator.next()

    if (!(value instanceof Promise)) {
      return done ? Result.succeed(value as A) : Result.fail(value as E)
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

      return Result.succeed(value as A)
    }

    return nextIteration(promise)
  })
