import { pipe, Stream, Effect, Result } from '../../../src'

describe('fromIterable', () => {
  it('should create a stream from an iterable', () => {
    pipe(
      Stream.fromIterable([]),
      Stream.toReadonlyArray,
      Effect.runSync(),
      expect,
    ).toEqual(Result.succeed([]))
    pipe(
      Stream.fromIterable([1, 2]),
      Stream.toReadonlyArray,
      Effect.runSync(),
      expect,
    ).toEqual(Result.succeed([1, 2]))
  })
})

describe('make', () => {
  it('should create a stream', () => {
    pipe(
      Stream.make(),
      Stream.toReadonlyArray,
      Effect.runSync(),
      expect,
    ).toEqual(Result.succeed([]))
    pipe(
      Stream.make(1, 2),
      Stream.toReadonlyArray,
      Effect.runSync(),
      expect,
    ).toEqual(Result.succeed([1, 2]))
  })
})

describe('withHandlers', () => {
  it('should return effect with handlers', async () => {
    pipe(
      Stream.withHandlers<number>(),
      Effect.flatMap(({ stream, push, finish }) => {
        push(1)
        finish()
        return stream
      }),
      Stream.toReadonlyArray,
      Effect.runSync(),
      expect,
    ).toEqual(Result.succeed([1]))
    const calls: string[] = []
    const result = await pipe(
      Stream.withHandlers<number>(),
      Effect.flatMap(({ stream, push, finish }) => {
        push(1)
        calls.push('Effect.flatMap')
        setTimeout(() => {
          push(2)
          calls.push('setTimeout')
          finish()
        })
        return stream
      }),
      Stream.map(x => {
        calls.push('Stream.map')
        return x
      }),
      Stream.toReadonlyArray,
      Effect.runAsync(),
    )
    expect(result).toEqual(Result.succeed([1, 2]))
    expect(calls).toEqual([
      'Effect.flatMap',
      'Stream.map',
      'Stream.map',
      'setTimeout',
    ])
  })
})
