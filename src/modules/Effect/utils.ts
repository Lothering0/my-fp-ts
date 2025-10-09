import * as Array from '../ReadonlyArray'
import * as Option from '../Option'
import * as Result from '../Result'
import * as Effect from './effect'
import { isFunction } from '../../utils/typeChecks'
import { identity } from '../Identity'
import { flow, pipe } from '../../utils/flow'
import { mapResult, map } from './functor'

export interface TryCatch<A, E> {
  readonly try: () => A
  readonly catch: (e: unknown) => E
}

const try_: {
  <A, E>(tryCatch: TryCatch<A, E>): Effect.Effect<Awaited<A>, E>
  <A>(operation: () => A): Effect.Effect<Awaited<A>, unknown>
} = <A, E>(
  operationOrTryCatch: TryCatch<A, E> | (() => A),
): Effect.Effect<A, E> => {
  let tryCatch: TryCatch<A, E>

  if (isFunction(operationOrTryCatch)) {
    tryCatch = {
      try: operationOrTryCatch,
      catch: identity<E>,
    }
  } else {
    tryCatch = operationOrTryCatch
  }

  try {
    const result = tryCatch.try()
    if (result instanceof Promise) {
      return Effect.fromAsyncResult(() =>
        result.then(Result.succeed, flow(tryCatch.catch, Result.fail)),
      )
    }
    return Effect.succeed(result)
  } catch (e) {
    return pipe(e, tryCatch.catch, Effect.fail)
  }
}

export { try_ as try }

export const toUnion: {
  <A, E>(self: Effect.Effect<A, E>): Effect.Effect<A | E>
} = mapResult(flow(Result.toUnion, Result.succeed))

export const swap: {
  <A, E>(self: Effect.Effect<A, E>): Effect.Effect<E, A>
} = mapResult(Result.swap)

type Successes<A extends ReadonlyArray<Effect.Effect<unknown, unknown>>> = {
  readonly [K in keyof A]: A[K] extends Effect.Effect<infer Succes, unknown>
    ? Succes
    : never
}

type Failure<A extends ReadonlyArray<Effect.Effect<unknown, unknown>>> = {
  readonly [K in keyof A]: A[K] extends Effect.Effect<unknown, infer Failure>
    ? Failure
    : never
}[number]

type EffectFromIterable<A extends Iterable<Effect.Effect<unknown, unknown>>> =
  A extends Iterable<Effect.Effect<infer Success, infer Failure>>
    ? Effect.Effect<ReadonlyArray<Success>, Failure>
    : never

export const all: {
  <const A extends ReadonlyArray<Effect.Effect<unknown, unknown>>>(
    effects: A,
  ): Effect.Effect<Successes<A>, Failure<A>>
  <A extends Iterable<Effect.Effect<unknown, unknown>>>(
    effects: A,
  ): EffectFromIterable<A>
} = (
  effects: Iterable<Effect.Effect<unknown, unknown>>,
): Effect.Effect<ReadonlyArray<unknown>, unknown> =>
  Effect.fromOperation<ReadonlyArray<unknown>, unknown>(() => {
    const out: (
      | Result.Result<unknown, unknown>
      | Promise<Result.Result<unknown, unknown>>
    )[] = []
    let includesPromise = false

    for (const effect of effects) {
      const result = effect.run()
      if (result instanceof Promise) {
        includesPromise = true
      } else if (Result.isFailure(result)) {
        return result
      }
      out.push(result)
    }

    if (includesPromise) {
      const rejectablePromises = pipe(
        out,
        Array.map(a => {
          if (!(a instanceof Promise)) {
            return a
          }

          return a.then(
            Result.match({
              onSuccess: Result.succeed,
              onFailure: e => Promise.reject(e),
            }),
          )
        }),
      )
      return Promise.all(rejectablePromises)
        .then(results =>
          pipe(
            results,
            Array.find(Result.isFailure),
            Option.match({
              onSome: identity,
              onNone: () => pipe(results, Array.successes, Result.succeed),
            }),
          ),
        )
        .catch(e => Result.fail(e))
    }

    return pipe(
      out as ReadonlyArray<Result.Success<unknown>>,
      Array.successes,
      Result.succeed,
    )
  })

type Results<A extends ReadonlyArray<Effect.Effect<unknown, unknown>>> = {
  readonly [K in keyof A]: A[K] extends Effect.Effect<
    infer Succes,
    infer Failure
  >
    ? Result.Result<Succes, Failure>
    : never
}

type ResultsFromIterable<A extends Iterable<Effect.Effect<unknown, unknown>>> =
  A extends Iterable<Effect.Effect<infer Success, infer Failure>>
    ? Effect.Effect<ReadonlyArray<Result.Result<Success, Failure>>>
    : never

export const allResults: {
  <const A extends ReadonlyArray<Effect.Effect<unknown, unknown>>>(
    effects: A,
  ): Effect.Effect<Results<A>>
  <A extends Iterable<Effect.Effect<unknown, unknown>>>(
    effects: A,
  ): ResultsFromIterable<A>
} = (
  effects: Iterable<Effect.Effect<unknown, unknown>>,
): Effect.Effect<ReadonlyArray<Result.Result<unknown, unknown>>> =>
  Effect.fromOperation<ReadonlyArray<Result.Result<unknown, unknown>>, never>(
    () => {
      const out: (
        | Result.Result<unknown, unknown>
        | Promise<Result.Result<unknown, unknown>>
      )[] = []
      let includesPromise = false

      for (const effect of effects) {
        const result = effect.run()
        if (result instanceof Promise) {
          includesPromise = true
        }
        out.push(result)
      }

      if (includesPromise) {
        return Promise.all(out).then(Result.succeed)
      }

      return pipe(
        out as ReadonlyArray<Result.Result<unknown, unknown>>,
        Result.succeed,
      )
    },
  )

type Options<A extends ReadonlyArray<Effect.Effect<unknown, unknown>>> = {
  readonly [K in keyof A]: A[K] extends Effect.Effect<infer Succes, unknown>
    ? Option.Option<Succes>
    : never
}

type OptionsFromIterable<A extends Iterable<Effect.Effect<unknown, unknown>>> =
  A extends Iterable<Effect.Effect<infer Success, unknown>>
    ? Effect.Effect<ReadonlyArray<Option.Option<Success>>>
    : never

export const allOptions: {
  <const A extends ReadonlyArray<Effect.Effect<unknown, unknown>>>(
    effects: A,
  ): Effect.Effect<Options<A>>
  <A extends Iterable<Effect.Effect<unknown, unknown>>>(
    effects: A,
  ): OptionsFromIterable<A>
} = flow(allResults, map(Array.map(Option.fromResult)))
