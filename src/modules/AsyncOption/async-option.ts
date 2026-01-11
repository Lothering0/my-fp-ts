import * as Async from '../Async'
import * as AsyncResult from '../AsyncResult'
import * as Result from '../Result'
import * as Option from '../Option'
import { Hkt } from '../../typeclasses/Hkt'
import { constant } from '../../utils/constant'
import { _AsyncOption } from './_internal'

export interface AsyncOptionHkt extends Hkt {
  readonly Type: AsyncOption<this['In']>
}

export interface AsyncOption<A> extends Async.Async<Option.Option<A>> {}

export interface AsyncOptionGenerator<A> {
  (
    make: <B>(self: AsyncOption<B>) => AsyncOptionIterable<B>,
  ): Generator<unknown, A>
}

export interface AsyncOptionIterable<A> {
  readonly [Symbol.iterator]: Option.OptionGenerator<A>
}

export const none: {
  <A = never>(): AsyncOption<A>
} = _AsyncOption.none

export const some: {
  <A>(a: A): AsyncOption<A>
} = _AsyncOption.some

const try_: {
  <A>(operation: () => Promise<A>): AsyncOption<A>
} = operation => () => {
  try {
    return operation().then(Option.some, Option.none)
  } catch {
    return Promise.resolve(Option.none())
  }
}

export { try_ as try }

export const toPromise: {
  <A>(ma: AsyncOption<A>): Promise<Option.Option<A>>
} = mma => mma()

/** Alias for `toPromise` */
export const run = toPromise

export const fromAsync: {
  <A>(ma: Async.Async<A>): AsyncOption<A>
} = ma => () => ma().then(Option.some)

export const fromAsyncResult: {
  <A, E>(ma: AsyncResult.AsyncResult<A, E>): AsyncOption<A>
} = ma => () =>
  ma().then(
    Result.match({
      onFailure: constant(Option.none()),
      onSuccess: Option.some,
    }),
  )

const makeIterable: {
  <A>(self: AsyncOption<A>): AsyncOptionIterable<A>
} = self => ({
  *[Symbol.iterator]() {
    const option = yield self() as any
    return option as any
  },
})

export const gen =
  <A>(generator: AsyncOptionGenerator<A>): AsyncOption<A> =>
  () => {
    const iterator = generator(makeIterable)
    let { value, done } = iterator.next()

    const promise = value as Promise<Option.Option<A>>

    const nextIteration = async (promise: Promise<Option.Option<A>>) => {
      const ma = await promise

      if (Option.isNone(ma)) {
        return Option.none()
      }

      if (!done) {
        const iterationResult = iterator.next(Option.valueOf(ma))
        value = iterationResult.value
        done = iterationResult.done
        return nextIteration(Promise.resolve(value) as any)
      }

      return Option.some(value as A)
    }

    return nextIteration(promise)
  }
