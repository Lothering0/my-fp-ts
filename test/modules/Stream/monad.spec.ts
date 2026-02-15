import { Effect, Stream, pipe, Result } from '../../../src'

describe('monad', () => {
  describe('flat', () => {
    it('should sequentially flatten synchronous streams', () => {
      const syncStream = Stream.make(Stream.make(1, 2, 3), Stream.make(4, 5, 6))
      pipe(
        syncStream,
        Stream.flat,
        Stream.toReadonlyArray,
        Effect.runSync(),
        expect,
      ).toEqual(Result.succeed([1, 2, 3, 4, 5, 6]))
    })

    it('should sequentially flatten asynchronous streams', async () => {
      const stream1 = Stream.create<string, never, number>(
        ({ push, finish }) =>
          r => {
            setTimeout(() => {
              push(`${r}-1`)
              finish()
            }, 20)
          },
      )
      const stream2 = Stream.create<string, never, number>(
        ({ push, finish }) =>
          r => {
            setTimeout(() => {
              push(`${r}-2`)
              finish()
            }, 10)
          },
      )
      const asyncStream = Stream.make<typeof stream1, never, number>(
        stream1,
        stream2,
      )
      const result = await pipe(
        asyncStream,
        Stream.flat,
        Stream.toReadonlyArray,
        Effect.runAsync(1),
      )
      expect(result).toEqual(Result.succeed(['1-1', '1-2']))
    })
  })
})
