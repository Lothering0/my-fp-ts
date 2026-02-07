import * as Effect from '../Effect'
import * as Chunk from '../Chunk'
import * as Result from '../Result'
import { Hkt as Hkt_ } from '../../typeclasses/Hkt'
import { pipe } from '../../utils/flow'

export interface Hkt extends Hkt_ {
  readonly Type: Stream<this['In'], this['Collectable']>
}

export interface Stream<A, E = never>
  extends Effect.Effect<Streamable<A, E>, E> {}

interface Streamable<A, E = never> {
  readonly _id: 'Streamable'
  readonly _consumers: Consumer<A, E>[]
  _result: Result.Result<Chunk.Chunk<A>, E>
  _isFinished: boolean
}

export interface Consumer<A, E = never> {
  readonly onPush?: (a: A, i: number) => void
  readonly onFail?: (e: E) => void
  readonly onFinish?: () => void
}

export interface Handlers<A, E = never> {
  readonly push: (a: A) => void
  readonly fail: (e: E) => void
  readonly finish: () => void
}

export interface WithHandlers<A, E = never> extends Handlers<A, E> {
  readonly stream: Stream<A, E>
}

const _create = <A, E = never>(
  f: (handlers: Handlers<A, E>) => void,
  forceAsync = false,
): Stream<A, E> => {
  const streamable: Streamable<A, E> = {
    _id: 'Streamable',
    _result: Result.succeed(Chunk.empty),
    _consumers: [],
    _isFinished: false,
  }
  let result = Result.succeed<Streamable<A, E>, E>(streamable)
  const onPush = (a: A) => {
    if (streamable._isFinished) {
      return
    }
    streamable._result = pipe(streamable._result, Result.map(Chunk.append(a)))
    const i = pipe(
      streamable._result,
      Result.map(({ length }) => length - 1),
      Result.getOrAbsurd,
    )
    streamable._consumers.forEach(({ onPush }) => onPush?.(a, i))
  }
  const onFail = (e: E) => {
    if (streamable._isFinished) {
      return
    }
    streamable._isFinished = true
    result = Result.fail(e)
    streamable._result = Result.fail(e)
    streamable._consumers.forEach(({ onFail }) => onFail?.(e))
  }
  const onFinish = () => {
    streamable._isFinished = true
    streamable._consumers.forEach(({ onFinish }) => onFinish?.())
  }
  return Effect.fromReaderResult(() => {
    if (!streamable._isFinished) {
      f({ push: onPush, fail: onFail, finish: onFinish })
    }
    return forceAsync ? Promise.resolve(result) : result
  })
}

export const create = <A, E = never>(
  f: (handlers: Handlers<A, E>) => void,
): Stream<A, E> => _create(f)

export const createAsync = <A, E = never>(
  f: (handlers: Handlers<A, E>) => void,
): Stream<A, E> => _create(f, true)

export const withHandlers = <A, E = never>(): Effect.Effect<
  WithHandlers<A, E>,
  E
> => {
  let push: Handlers<A, E>['push']
  let fail: Handlers<A, E>['fail']
  let finish: Handlers<A, E>['finish']
  const stream = create<A, E>(handlers => {
    push = handlers.push
    fail = handlers.fail
    finish = handlers.finish
  })
  return pipe(
    stream,
    Effect.map(() => ({ stream, push, fail, finish })),
  )
}
