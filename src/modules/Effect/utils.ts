import * as Result from '../Result'
import * as Effect from './effect'
import { isFunction } from '../../utils/typeChecks'
import { identity } from '../Identity'
import { flow, pipe } from '../../utils/flow'

export interface Try<A, E> {
  readonly try: () => A
  readonly catch: (e: unknown) => E
}

const try_: {
  <A, E>(matchers: Try<A, E>): Effect.Effect<Awaited<A>, E>
  <A>(operation: () => A): Effect.Effect<Awaited<A>, Error>
} = <A, E>(operationOrMatchers: Try<A, E> | (() => A)): Effect.Effect<A, E> => {
  let matchers: Try<A, E>

  if (isFunction(operationOrMatchers)) {
    matchers = {
      try: operationOrMatchers,
      catch: identity<E>,
    }
  } else {
    matchers = operationOrMatchers
  }

  try {
    const result = matchers.try()
    if (result instanceof Promise) {
      return Effect.fromAsyncResult(() =>
        result.then(Result.succeed, flow(matchers.catch, Result.fail)),
      )
    }
    return Effect.succeed(result)
  } catch (e) {
    return pipe(e, matchers.catch, Effect.fail)
  }
}

export { try_ as try }
