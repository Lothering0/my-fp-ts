import { AsyncResult, identity, Number, pipe, Result } from '../../../src'

describe('functor', () => {
  describe('map', () => {
    it('should satisfy identity law', async () => {
      const a = 1
      const fa: AsyncResult.AsyncResult<number> = jest.fn(AsyncResult.of(a))

      const result = await pipe(
        fa,
        AsyncResult.map(identity),
        AsyncResult.toPromise,
      )
      expect(result).toEqual(Result.succeed(a))
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy composition law', async () => {
      const ab = Number.add(5)
      const bc = Number.divide(2)

      const a = 1
      const getFa = () => AsyncResult.of<typeof a>(a)

      const fa1: AsyncResult.AsyncResult<typeof a> = jest.fn(getFa())
      const fa2: AsyncResult.AsyncResult<typeof a> = jest.fn(getFa())

      const result1 = await pipe(
        fa1,
        AsyncResult.map(a => bc(ab(a))),
        AsyncResult.toPromise,
      )
      const result2 = await pipe(
        fa2,
        AsyncResult.map(ab),
        AsyncResult.map(bc),
        AsyncResult.toPromise,
      )

      expect(result1).toEqual(result2)
      expect(fa1).toHaveBeenCalledTimes(1)
      expect(fa2).toHaveBeenCalledTimes(1)
    })

    it('should return function containing promise of `failure` if the same was provided', async () => {
      const a = 1
      const n = 1
      const fe: AsyncResult.AsyncResult<never, typeof a> = jest.fn(
        AsyncResult.fail(a),
      )
      const result = await pipe(
        fe,
        AsyncResult.map(Number.add(n)),
        AsyncResult.toPromise,
      )
      expect(result).toEqual(Result.fail(a))
      expect(fe).toHaveBeenCalledTimes(1)
    })

    it('should return function containing promise of `success` if it was provided', async () => {
      const a = 1
      const n = 1
      const fa: AsyncResult.AsyncResult<typeof a> = jest.fn(
        AsyncResult.succeed(a),
      )
      const result = await pipe(
        fa,
        AsyncResult.map(Number.add(n)),
        AsyncResult.toPromise,
      )
      expect(result).toEqual(Result.succeed(Number.add(a)(n)))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })
})
