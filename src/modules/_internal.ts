import { Hkt, Kind } from '../typeclasses/Hkt'
import { Monad } from '../typeclasses/Monad'
import { pipe as pipe_ } from '../utils/flow'

export const nonEmpty: unique symbol = Symbol('nonEmpty')

interface NonEmptyObject {
  readonly [nonEmpty]: undefined
}

export interface NonEmptyIterable<A> extends Iterable<A>, NonEmptyObject {}

export const getIterableGen =
  <F extends Hkt, U>(Monad: Monad<F>, genUtils: U) =>
  <A>(generator: {
    (genUtils: U): Generator<unknown, A>
  }): Kind<F, A, unknown> => {
    const run = (args: unknown[]): Kind<F, A, unknown> => {
      const iterator = generator(genUtils)
      let yielded = iterator.next()
      for (const arg of args) {
        yielded = iterator.next(arg)
      }
      if (!yielded.done) {
        const { value } = yielded
        const xs = typeof value === 'function' ? value() : value
        return pipe_(
          xs,
          Monad.flatMap(x => run([...args, x])),
        )
      }
      return Monad.of(yielded.value)
    }

    return run([])
  }

export function pipe(...fs: any[]) {
  return pipe_(this, ...(fs as [any]))
}
