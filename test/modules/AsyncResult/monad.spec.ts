import { AsyncResult, flow, pipe, Result } from '../../../src'

describe('monad', () => {
  describe('flatMap', () => {
    it('should satisfy left identity law', async () => {
      const a = 1
      const fa: AsyncResult.AsyncResult<typeof a> = jest.fn(AsyncResult.of(a))
      const afb = (x: number) => AsyncResult.of(x + 1)

      const result1 = await pipe(
        fa,
        AsyncResult.flatMap(afb),
        AsyncResult.toPromise,
      )
      const result2 = await pipe(a, afb, AsyncResult.toPromise)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy right identity law', async () => {
      const a = 1
      const fa: AsyncResult.AsyncResult<typeof a> = jest.fn(AsyncResult.of(a))

      const result1 = await pipe(
        fa,
        AsyncResult.flatMap(AsyncResult.of),
        AsyncResult.toPromise,
      )
      const result2 = await pipe(fa, AsyncResult.toPromise)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })

    it('should satisfy associativity law', async () => {
      const a = 1
      const fa: AsyncResult.AsyncResult<typeof a> = jest.fn(AsyncResult.of(a))
      const afb = (x: number) => AsyncResult.of(x + 1)
      const bfc = (x: number) => AsyncResult.of(x / 2)

      const result1 = await pipe(
        fa,
        AsyncResult.flatMap(afb),
        AsyncResult.flatMap(bfc),
        AsyncResult.toPromise,
      )
      const result2 = await pipe(
        fa,
        AsyncResult.flatMap(flow(afb, AsyncResult.flatMap(bfc))),
        AsyncResult.toPromise,
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })

    it('should return function containing `failure` if the same was provided', async () => {
      const e = 'e'
      const fa: AsyncResult.AsyncResult<never, typeof e> = jest.fn(
        AsyncResult.fail(e),
      )
      const result = await pipe(
        fa,
        AsyncResult.flatMap(a => AsyncResult.succeed(a + 2)),
        AsyncResult.toPromise,
      )
      expect(result).toEqual<Result.Result<never, typeof e>>(Result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `failure` if the same was returned by callback function', async () => {
      const e = 'e'
      const a = 1
      const fa: AsyncResult.AsyncResult<typeof a, typeof e> = jest.fn(
        AsyncResult.succeed(a),
      )
      const result = await pipe(
        fa,
        AsyncResult.flatMap(() => AsyncResult.fail(e)),
        AsyncResult.toPromise,
      )
      expect(result).toEqual<Result.Result<never, typeof e>>(Result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })
})
