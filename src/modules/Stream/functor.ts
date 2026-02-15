import * as Stream from './stream'
import * as Effect from '../Effect'
import * as Functor_ from '../../typeclasses/Functor'
import * as FunctorWithIndex_ from '../../typeclasses/FunctorWithIndex'
import { pipe } from '../../utils/flow'
import { listen } from './_internal'

export const Functor = Functor_.create<Stream.Hkt>({
  map: ab => stream =>
    pipe(
      stream,
      Effect.flatMap(streamable =>
        Stream.create(({ push, fail, finish }) => () => {
          pipe(
            streamable,
            listen({
              onPush: a => push(ab(a)),
              onFail: fail,
              onFinish: finish,
            }),
          )
        }),
      ),
    ),
})

export const map =
  <A, B>(aib: (a: A, i: number) => B) =>
  <E, R>(stream: Stream.Stream<A, E, R>): Stream.Stream<B, E, R> =>
    pipe(
      stream,
      Effect.flatMap(streamable =>
        Stream.create(({ push, fail, finish }) => () => {
          pipe(
            streamable,
            listen({
              onPush: (a, i) => push(aib(a, i)),
              onFail: fail,
              onFinish: finish,
            }),
          )
        }),
      ),
    )

export const FunctorWithIndex: FunctorWithIndex_.FunctorWithIndex<
  Stream.Hkt,
  number
> = {
  ...Functor,
  mapWithIndex: map,
}

export const as: {
  <A>(a: A): <E>(stream: Stream.Stream<unknown, E>) => Stream.Stream<A, E>
} = FunctorWithIndex.as as any
