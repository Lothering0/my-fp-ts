import * as Chunk from '../Chunk'
import * as Result from '../Result'
import * as Stream from './stream'
import { pipe } from '../../utils/flow'

export interface Streamable<A, E = never> {
  readonly _id: 'Streamable'
  readonly _consumers: Stream.Consumer<A, E>[]
  _result: Result.Result<Chunk.Chunk<A>, E>
  _isFinished: boolean
}

export const listen =
  <A, E>(consumer: Stream.Consumer<A, E>) =>
  (streamable: Streamable<A, E>) => {
    pipe(
      streamable._result,
      Result.map(chunk => {
        let i = -1
        for (const a of chunk) {
          i++
          consumer.onPush?.(a, i)
        }
        if (streamable._isFinished) {
          consumer.onFinish?.()
        }
      }),
      Result.mapLeft(e => consumer.onFail?.(e)),
    )
    streamable._consumers.push({
      onPush: (a, i) => consumer.onPush?.(a, i),
      onFail: e => consumer.onFail?.(e),
      onFinish: () => consumer.onFinish?.(),
    })
  }
