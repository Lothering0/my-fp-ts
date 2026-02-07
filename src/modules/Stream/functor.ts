import * as Stream from './stream'
import * as Effect from '../Effect'
import * as Result from '../Result'
import * as Functor_ from '../../typeclasses/Functor'
import * as FunctorWithIndex_ from '../../typeclasses/FunctorWithIndex'
import { pipe } from '../../utils/flow'

export const Functor = Functor_.create<Stream.Hkt>({
  map: ab => stream =>
    pipe(
      stream,
      Effect.flatMap(streamable =>
        Stream.create(({ push, fail, finish }) => {
          pipe(
            streamable._result,
            Result.map(chunk => {
              for (const a of chunk) {
                push(ab(a))
              }
              if (streamable._isFinished) {
                finish()
              }
            }),
            Result.mapLeft(fail),
          )
          streamable._consumers.push({
            onPush: a => push(ab(a)),
            onFail: fail,
            onFinish: finish,
          })
        }),
      ),
    ),
})

export const map =
  <A, B>(ab: (a: A, i: number) => B) =>
  <E>(stream: Stream.Stream<A, E>): Stream.Stream<B, E> =>
    pipe(
      stream,
      Effect.flatMap(streamable =>
        Stream.create(({ push, fail, finish }) => {
          pipe(
            streamable._result,
            Result.map(chunk => {
              let i = -1
              for (const a of chunk) {
                i++
                push(ab(a, i))
              }
              if (streamable._isFinished) {
                finish()
              }
            }),
            Result.mapLeft(fail),
          )
          streamable._consumers.push({
            onPush: (a, i) => push(ab(a, i)),
            onFail: fail,
            onFinish: finish,
          })
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
