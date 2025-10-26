/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Result from '../Result'
import { hole } from '../../utils/hole'
import {
  AsyncEffectException,
  Effect,
  EffectGenerator,
  EffectValue,
  SyncEffectException,
} from './effect'

export function _run<A, E>(
  effect: Effect<A, E>,
  type?: 'sync',
): Result.Result<A, E>
export function _run<A, E>(
  effect: Effect<A, E>,
  type?: 'async',
): Promise<Result.Result<A, E>>
export function _run<A, E>(effect: Effect<A, E>, type?: 'sync' | 'async') {
  let value
  let previous = effect.previous
  const fs: ((
    result?: Result.Result<unknown, unknown>,
  ) => EffectValue<unknown, unknown>)[] = [effect.mapper]

  while (previous !== undefined) {
    fs.unshift(previous.mapper)
    previous = previous.previous
  }

  for (const f of fs) {
    if (value instanceof Promise) {
      if (type === 'sync') {
        throw new AsyncEffectException()
      }

      value = value.then(f)
    } else {
      value = f(value)
    }
  }

  if (value instanceof Promise) {
    if (type === 'sync') {
      throw new AsyncEffectException()
    }
  } else {
    if (type === 'async') {
      throw new SyncEffectException()
    }
  }

  return value
}

const getEffectGenerator: {
  <A, E>(effect: Effect<A, E>): EffectGenerator<A, E>
} = effect =>
  function* effectGenerator() {
    const value = _run(effect)
    if (value instanceof Promise) {
      const result = yield value as any
      return result as any
    }
    const result = yield* value
    return result
  }

export const create = <B, D, A, E>(
  mapper: (result: Result.Result<B, D>) => EffectValue<A, E>,
  previous?: Effect<B, D>,
): Effect<A, E> => {
  const effect: Effect<A, E> = {
    _id: 'Effect',
    mapper,
    previous,
    [Symbol.iterator]: hole(),
  }
  ;(effect as any)[Symbol.iterator] = getEffectGenerator(effect)
  return effect
}
