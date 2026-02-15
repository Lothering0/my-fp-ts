import * as Result from '../Result'
import * as Reader from '../Reader'
import * as Sync from '../Sync'
import * as Async from '../Async'
import * as AsyncResult from '../AsyncResult'
import * as SyncResult from '../SyncResult'
import { flow, Pipeable } from '../../utils/flow'
import { Hkt as Hkt_ } from '../../typeclasses/Hkt'
import { TaggedTypeError } from '../Exception'
import { _run, create } from './_internal'

export interface Hkt extends Hkt_ {
  readonly Type: Effect<this['In'], this['Collectable'], this['Fixed']>
}

export interface Effect<A, E = never, R = unknown> extends Pipeable {
  readonly _id: 'Effect'
  readonly mapper: (
    result?: Result.Result<unknown, unknown>,
  ) => Reader.Reader<R, EffectValue<A, E>>
  // Using chain of effects to avoid potential call stack overflows
  readonly previous: Effect<unknown, unknown, unknown> | undefined
  readonly [Symbol.iterator]: EffectGenerator<A, E, R>
}

export interface EffectGenerator<A, E = never, R = undefined> {
  (): Generator<E, A, R>
}

export type EffectValue<A, E = never> =
  | Result.Result<A, E>
  | Promise<Result.Result<A, E>>

export interface EffectOperation<A, E = never> {
  (): EffectValue<A, E>
}

export type Successes<
  EffectInstance extends Effect<unknown, unknown, unknown>,
> =
  EffectInstance extends Effect<infer Successes, unknown, unknown>
    ? Successes
    : never

export type Failures<EffectInstance extends Effect<unknown, unknown, unknown>> =
  EffectInstance extends Effect<unknown, infer Failures, unknown>
    ? Failures
    : never

export type Dependencies<
  EffectInstance extends Effect<unknown, unknown, unknown>,
> =
  EffectInstance extends Effect<unknown, unknown, infer Dependencies>
    ? Dependencies
    : never

export class AsyncEffectException extends TaggedTypeError(
  'AsyncEffectException',
) {}

export class SyncEffectException extends TaggedTypeError(
  'SyncEffectException',
) {}

export const run: {
  (): <A, E>(effect: Effect<A, E, undefined>) => EffectValue<A, E>
  <R>(r: R): <A, E>(effect: Effect<A, E, R>) => EffectValue<A, E>
} = (<R>(r: R) =>
  <A, E>(effect: Effect<A, E, R>) =>
    _run(effect, r)) as any

/** Throws an error when `Effect` instance starts to run asynchronously */
export const runSync: {
  (): <A, E>(effect: Effect<A, E, undefined>) => Result.Result<A, E>
  <R>(r: R): <A, E>(effect: Effect<A, E, R>) => Result.Result<A, E>
} = (<R>(r: R) =>
  <A, E>(effect: Effect<A, E, R>) =>
    _run(effect, r, 'sync')) as any

/** Throws an error if `Effect` instance don't returned a `Promise` */
export const runAsync: {
  (): <A, E>(effect: Effect<A, E, undefined>) => Promise<Result.Result<A, E>>
  <R>(r: R): <A, E>(effect: Effect<A, E, R>) => Promise<Result.Result<A, E>>
} = (<R>(r: R) =>
  <A, E>(effect: Effect<A, E, R>) =>
    _run(effect, r, 'async')) as any

export const toPromise: {
  <R>(r: R): <A, E>(effect: Effect<A, E, R>) => Promise<Result.Result<A, E>>
} = r => effect => Promise.resolve(_run(effect, r))

export const fromReader: {
  <A, E = never, R = undefined>(reader: Reader.Reader<R, A>): Effect<A, E, R>
} = operation => create(() => flow(operation, Result.succeed))

export const fromReaderResult: {
  <A, E = never, R = undefined>(
    reader: Reader.Reader<R, EffectValue<A, E>>,
  ): Effect<A, E, R>
} = operation => create(() => operation)

export const succeed: {
  <A>(a: A): Effect<A>
} = a => create(() => () => Result.succeed(a))

export const fail: {
  <E>(e: E): Effect<never, E>
} = e => create(() => () => Result.fail(e))

export const fromSyncResult: {
  <A, E, R>(syncResult: SyncResult.SyncResult<A, E>): Effect<A, E, R>
} = fromReaderResult

export const fromSync: {
  <A>(sync: Sync.Sync<A>): Effect<A>
} = flow(Sync.map(Result.succeed), fromSyncResult)

export const fromAsyncResult: {
  <A, E>(asyncResult: AsyncResult.AsyncResult<A, E>): Effect<A, E>
} = fromReaderResult

export const fromAsync: {
  <A>(async: Async.Async<A>): Effect<A>
} = flow(Async.map(Result.succeed), fromAsyncResult)

const iteratePromise = async <A, E, R>(
  r: R,
  resultPromise: Promise<Result.Result<A, E>>,
  iterator: Generator<E, A, R>,
): Promise<Result.Result<A, E>> => {
  const result = await resultPromise

  if (Result.isFailure(result)) {
    return result
  }

  let { value, done } = iterator.next(result.success as any)

  while (!done) {
    const iteration1 = iterator.next(r)
    const result: Result.Result<A, E> = (await iteration1.value) as any

    if (Result.isFailure(result)) {
      return result
    }

    const iteration2 = iterator.next(result.success as any)
    value = iteration2.value
    done = iteration2.done
  }

  return Result.succeed(value as A)
}

export const gen = <A, E = never, R = undefined>(
  generator: () => Generator<E, A, R>,
): Effect<A, E, R> =>
  fromReaderResult(r => {
    const iterator = generator()
    let { value, done } = iterator.next()
    while (!done) {
      const iteration1 = iterator.next(r)
      const result: EffectValue<A, E> = iteration1.value as any

      if (result instanceof Promise) {
        return iteratePromise(r, result, iterator)
      }

      if (Result.isFailure(result)) {
        return result
      }

      const iteration2 = iterator.next(result.success as any)
      value = iteration2.value
      done = iteration2.done
    }

    return Result.succeed(value as A)
  })
