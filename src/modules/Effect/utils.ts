import * as Array from '../ReadonlyArray'
import * as Option from '../Option'
import * as Result from '../Result'
import * as Effect from './effect'
import { isFunction } from '../../utils/typeChecks'
import { flow, pipe } from '../../utils/flow'
import { mapResult, map } from './functor'
import { UnknownException } from '../Exception'
import { TryCatch } from '../../types/TryCatch'

const try_: {
  <A, E>(tryCatch: TryCatch<A, E>): Effect.Effect<Awaited<A>, E>
  <A>(operation: () => A): Effect.Effect<Awaited<A>, UnknownException>
} = <A, E>(
  operationOrTryCatch: TryCatch<A, E> | (() => A),
): Effect.Effect<A, E> => {
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
    const result = tryCatch.try()
    if (result instanceof Promise) {
      return Effect.fromAsyncResult(() =>
        result.then(Result.succeed).catch(flow(tryCatch.catch, Result.fail)),
      )
    }
    return Effect.succeed(result)
  } catch (e) {
    return pipe(e, tryCatch.catch, Effect.fail)
  }
}

export { try_ as try }

export const toUnion: {
  <A, E, R>(self: Effect.Effect<A, E, R>): Effect.Effect<A | E, never, R>
} = mapResult(ma => () => pipe(ma, Result.toUnion, Result.succeed))

export const swap: {
  <A, E, R>(self: Effect.Effect<A, E, R>): Effect.Effect<E, A, R>
} = mapResult(ma => () => Result.swap(ma))

type Successes<
  A extends ReadonlyArray<Effect.Effect<unknown, unknown, unknown>>,
> = {
  readonly [K in keyof A]: A[K] extends Effect.Effect<
    infer Succes,
    unknown,
    unknown
  >
    ? Succes
    : never
}

type Failure<
  A extends ReadonlyArray<Effect.Effect<unknown, unknown, unknown>>,
> = {
  readonly [K in keyof A]: A[K] extends Effect.Effect<
    unknown,
    infer Failure,
    unknown
  >
    ? Failure
    : never
}[number]

type EffectFromIterable<
  R,
  A extends Iterable<Effect.Effect<unknown, unknown, R>>,
> =
  A extends Iterable<Effect.Effect<infer Success, infer Failure, R>>
    ? Effect.Effect<ReadonlyArray<Success>, Failure, R>
    : never

export const all: {
  <R, const A extends ReadonlyArray<Effect.Effect<unknown, unknown, R>>>(
    effects: A,
  ): Effect.Effect<Successes<A>, Failure<A>, R>
  <R, A extends Iterable<Effect.Effect<unknown, unknown, R>>>(
    effects: A,
  ): EffectFromIterable<R, A>
} = (
  effects: Iterable<Effect.Effect<unknown, unknown>>,
): Effect.Effect<ReadonlyArray<unknown>, unknown, unknown> =>
  Effect.fromReader<ReadonlyArray<unknown>, unknown, unknown>(r => {
    const out: (
      | Result.Result<unknown, unknown>
      | Promise<Result.Result<unknown, unknown>>
    )[] = []
    let includesPromise = false

    for (const effect of effects) {
      const result = Effect.run(r)(effect)
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
            Option.getOrElse(() =>
              pipe(results, Array.successes, Result.succeed),
            ),
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

type Results<
  A extends ReadonlyArray<Effect.Effect<unknown, unknown, unknown>>,
> = {
  readonly [K in keyof A]: A[K] extends Effect.Effect<
    infer Succes,
    infer Failure,
    unknown
  >
    ? Result.Result<Succes, Failure>
    : never
}

type ResultsFromIterable<
  R,
  A extends Iterable<Effect.Effect<unknown, unknown, R>>,
> =
  A extends Iterable<Effect.Effect<infer Success, infer Failure, R>>
    ? Effect.Effect<ReadonlyArray<Result.Result<Success, Failure>>, never, R>
    : never

export const allResults: {
  <R, const A extends ReadonlyArray<Effect.Effect<unknown, unknown, R>>>(
    effects: A,
  ): Effect.Effect<Results<A>, never, R>
  <R, A extends Iterable<Effect.Effect<unknown, unknown, R>>>(
    effects: A,
  ): ResultsFromIterable<R, A>
} = (
  effects: Iterable<Effect.Effect<unknown, unknown, unknown>>,
): Effect.Effect<
  ReadonlyArray<Result.Result<unknown, unknown>>,
  never,
  unknown
> =>
  Effect.fromReader<
    ReadonlyArray<Result.Result<unknown, unknown>>,
    never,
    unknown
  >(r => {
    const out: (
      | Result.Result<unknown, unknown>
      | Promise<Result.Result<unknown, unknown>>
    )[] = []
    let includesPromise = false

    for (const effect of effects) {
      const result = Effect.run(r)(effect)
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
  })

type Options<
  A extends ReadonlyArray<Effect.Effect<unknown, unknown, unknown>>,
> = {
  readonly [K in keyof A]: A[K] extends Effect.Effect<
    infer Succes,
    unknown,
    unknown
  >
    ? Option.Option<Succes>
    : never
}

type OptionsFromIterable<
  R,
  A extends Iterable<Effect.Effect<unknown, unknown, R>>,
> =
  A extends Iterable<Effect.Effect<infer Success, unknown, R>>
    ? Effect.Effect<ReadonlyArray<Option.Option<Success>>, never, R>
    : never

export const allOptions: {
  <R, const A extends ReadonlyArray<Effect.Effect<unknown, unknown, R>>>(
    effects: A,
  ): Effect.Effect<Options<A>, never, R>
  <R, A extends Iterable<Effect.Effect<unknown, unknown, R>>>(
    effects: A,
  ): OptionsFromIterable<R, A>
} = flow(allResults, ma => ma, map(Array.map(Option.fromResult)))
