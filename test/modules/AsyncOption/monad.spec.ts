import { AsyncOption, flow, Option, pipe } from '../../../src'

describe('monad', () => {
  describe('flatMap', () => {
    it('should satisfy left identity law', async () => {
      const a = 1
      const fa: AsyncOption.AsyncOption<typeof a> = jest.fn(AsyncOption.of(a))
      const afb = (x: number) => AsyncOption.of(x + 1)

      const result1 = await pipe(
        fa,
        AsyncOption.flatMap(afb),
        AsyncOption.toPromise,
      )
      const result2 = await pipe(a, afb, AsyncOption.toPromise)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy right identity law', async () => {
      const a = 1
      const fa: AsyncOption.AsyncOption<typeof a> = jest.fn(AsyncOption.of(a))

      const result1 = await pipe(
        fa,
        AsyncOption.flatMap(AsyncOption.of),
        AsyncOption.toPromise,
      )
      const result2 = await pipe(fa, AsyncOption.toPromise)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })

    it('should satisfy associativity law', async () => {
      const a = 1
      const fa: AsyncOption.AsyncOption<typeof a> = jest.fn(AsyncOption.of(a))
      const afb = (x: number) => AsyncOption.of(x + 1)
      const bfc = (x: number) => AsyncOption.of(x / 2)

      const result1 = await pipe(
        fa,
        AsyncOption.flatMap(afb),
        AsyncOption.flatMap(bfc),
        AsyncOption.toPromise,
      )
      const result2 = await pipe(
        fa,
        AsyncOption.flatMap(flow(afb, AsyncOption.flatMap(bfc))),
        AsyncOption.toPromise,
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })

    it('should return function containing `none` if the same was provided', async () => {
      const fa: AsyncOption.AsyncOption<number> = jest.fn(AsyncOption.none)
      const result = await pipe(
        fa,
        AsyncOption.flatMap(a => AsyncOption.some(a + 2)),
        AsyncOption.toPromise,
      )
      expect(result).toEqual<Option.Option<never>>(Option.none)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `none` if the same was returned by callback function', async () => {
      const a = 1
      const fa: AsyncOption.AsyncOption<number> = jest.fn(AsyncOption.some(a))
      const result = await pipe(
        fa,
        AsyncOption.flatMap(AsyncOption.zero),
        AsyncOption.toPromise,
      )
      expect(result).toEqual<Option.Option<never>>(Option.none)
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })
})
