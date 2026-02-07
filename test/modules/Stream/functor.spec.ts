import { Stream, Effect, Result, pipe } from '../../../src'

describe('functor', () => {
  describe('map', () => {
    it('should correctly run a synchronous successful stream', () => {
      const f = jest.fn()
      const syncStream = Stream.create<number>(({ push, finish }) => {
        f()
        for (let i = 1; i < 5; i++) {
          push(i)
        }
        finish()
      })
      const result1 = pipe(
        syncStream,
        Stream.map((a, i) => `${i}-${a}`),
        Stream.toReadonlyArray,
        Effect.runSync(),
      )
      pipe(result1, expect).toEqual(
        Result.succeed(['0-1', '1-2', '2-3', '3-4']),
      )
      const result2 = pipe(
        syncStream,
        Stream.map((a, i) => `${i}-${a}`),
        Stream.map((a, i) => `${i}-${a}`),
        Stream.toReadonlyArray,
        Effect.runSync(),
      )
      pipe(result2, expect).toEqual(
        Result.succeed(['0-0-1', '1-1-2', '2-2-3', '3-3-4']),
      )
      expect(f).toHaveBeenCalledTimes(1)
    })

    it('should correctly run an asynchronous successful stream', async () => {
      const f = jest.fn()
      const asyncStream = Stream.createAsync<number>(({ push, finish }) => {
        f()
        let i = 0
        const interval = setInterval(() => {
          i++
          push(i)
          if (i === 3) {
            clearInterval(interval)
            finish()
          }
        })
      })
      const result1 = await pipe(
        asyncStream,
        Stream.map((a, i) => `${i}-${a}`),
        Stream.toReadonlyArray,
        Effect.runAsync(),
      )
      pipe(result1, expect).toEqual(Result.succeed(['0-1', '1-2', '2-3']))
      const result2 = await pipe(
        asyncStream,
        Stream.map((a, i) => `${i}-${a}`),
        Stream.map((a, i) => `${i}-${a}`),
        Stream.toReadonlyArray,
        Effect.runAsync(),
      )
      pipe(result2, expect).toEqual(Result.succeed(['0-0-1', '1-1-2', '2-2-3']))
      expect(f).toHaveBeenCalledTimes(1)
    })

    it('should correctly run a synchronous stream that failed at start', () => {
      const f = jest.fn()
      const g = jest.fn()
      const syncStream = Stream.create<number, string>(({ push, fail }) => {
        f()
        fail('e')
        for (let i = 0; i < 5; i++) {
          push(i)
        }
      })
      const result = pipe(
        syncStream,
        Stream.map((a, i) => {
          g()
          return `${i}-${a}`
        }),
        Stream.toChunk,
        Effect.runSync(),
      )
      pipe(result, expect).toEqual(Result.fail('e'))
      expect(f).toHaveBeenCalledTimes(1)
      expect(g).toHaveBeenCalledTimes(0)
    })

    it('should correctly run an asynchronous stream that failed at start', async () => {
      const f = jest.fn()
      const g = jest.fn()
      const asyncStream = Stream.createAsync<number, string>(
        ({ push, fail }) => {
          f()
          fail('e')
          for (let i = 0; i < 5; i++) {
            push(i)
          }
        },
      )
      const result = await pipe(
        asyncStream,
        Stream.map((a, i) => {
          g()
          return `${i}-${a}`
        }),
        Stream.toChunk,
        Effect.runAsync(),
      )
      pipe(result, expect).toEqual(Result.fail('e'))
      expect(f).toHaveBeenCalledTimes(1)
      expect(g).toHaveBeenCalledTimes(0)
    })

    it('should correctly run a synchronous stream that failed at mid', () => {
      const f = jest.fn()
      const g = jest.fn()
      const syncStream = Stream.create<number, string>(({ push, fail }) => {
        f()
        for (let i = 0; i < 5; i++) {
          push(i)
          if (i === 3) {
            fail('e')
          }
        }
      })
      const result = pipe(
        syncStream,
        Stream.map((a, i) => {
          g()
          return `${i}-${a}`
        }),
        Stream.toChunk,
        Effect.runSync(),
      )
      pipe(result, expect).toEqual(Result.fail('e'))
      expect(f).toHaveBeenCalledTimes(1)
      expect(g).toHaveBeenCalledTimes(0)
    })

    it('should correctly run an asynchronous stream that failed at mid', async () => {
      const f = jest.fn()
      const g = jest.fn()
      const asyncStream = Stream.createAsync<number, string>(
        ({ push, fail }) => {
          f()
          let i = 0
          const interval = setInterval(() => {
            i++
            push(i)
            if (i === 3) {
              clearInterval(interval)
              fail('e')
            }
          })
        },
      )
      const result = await pipe(
        asyncStream,
        Stream.map((a, i) => {
          g()
          return `${i}-${a}`
        }),
        Stream.toChunk,
        Effect.runAsync(),
      )
      pipe(result, expect).toEqual(Result.fail('e'))
      expect(f).toHaveBeenCalledTimes(1)
      expect(g).toHaveBeenCalledTimes(3)
    })
  })
})
