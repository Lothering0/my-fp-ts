import * as Result from '../Result'
import * as Reader from '../Reader'
import { hole } from '../../utils/hole'
import {
  AsyncEffectException,
  Effect,
  EffectGenerator,
  EffectValue,
  SyncEffectException,
} from './effect'
import { pipe } from '../_internal'

export function _run<A, E, R>(
  effect: Effect<A, E, R>,
  r: R,
  type?: 'sync',
): Result.Result<A, E>
export function _run<A, E, R>(
  effect: Effect<A, E, R>,
  r: R,
  type?: 'async',
): Promise<Result.Result<A, E>>
export function _run<A, E, R>(
  effect: Effect<A, E>,
  r: R,
  type?: 'sync' | 'async',
) {
  let value
  let previous = effect.previous
  const fs: ((
    result?: Result.Result<unknown, unknown>,
  ) => Reader.Reader<unknown, EffectValue<unknown, unknown>>)[] = [
    effect.mapper,
  ]

  while (previous !== undefined) {
    fs.push(previous.mapper)
    previous = previous.previous
  }

  for (let i = fs.length - 1; i >= 0; i--) {
    const f = fs[i]!
    if (value instanceof Promise) {
      if (type === 'sync') {
        throw new AsyncEffectException()
      }

      value = value.then(ma => f(ma)(r))
    } else {
      value = f(value)(r)
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

const getEffectGenerator = <A, E, R>(
  effect: Effect<A, E, R>,
): EffectGenerator<A, E, R> =>
  function* effectGenerator() {
    const r = yield
    const value = _run(effect, r)
    const result = yield value as any
    return result as any
  }

export const create = <B, D, A, E, R>(
  mapper: (result: Result.Result<B, D>) => Reader.Reader<R, EffectValue<A, E>>,
  previous?: Effect<B, D, R>,
): Effect<A, E, R> => {
  const effect: Effect<A, E, R> = {
    _id: 'Effect',
    mapper,
    previous,
    pipe,
    [Symbol.iterator]: hole(),
  }
  ;(effect as any)[Symbol.iterator] = getEffectGenerator(effect)
  return Object.freeze(effect)
}
