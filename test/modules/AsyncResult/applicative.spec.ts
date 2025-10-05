import { AsyncResult, identity, Number, pipe, Result } from '../../../src'

describe('applicative', () => {
  describe('apply', () => {
    it('should satisfy identity law', async () => {
      const a = 1
      const fa: AsyncResult.AsyncResult<typeof a> = jest.fn(AsyncResult.of(a))

      const result = await pipe(
        identity,
        AsyncResult.of,
        AsyncResult.apply(fa),
        AsyncResult.toPromise,
      )

      expect(result).toEqual<Result.Result<typeof a>>(Result.succeed(a))
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy homomorphism law', async () => {
      const a = 1
      const ab = Number.add(5)

      const fab: AsyncResult.AsyncResult<typeof ab> = jest.fn(
        AsyncResult.of(ab),
      )
      const fa: AsyncResult.AsyncResult<typeof a> = jest.fn(AsyncResult.of(a))

      const result1 = await pipe(
        fab,
        AsyncResult.apply(fa),
        AsyncResult.toPromise,
      )
      const result2 = await pipe(a, ab, AsyncResult.of, AsyncResult.toPromise)

      expect(result1).toEqual(result2)
      expect(fab).toHaveBeenCalledTimes(1)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy interchange law', async () => {
      const a = 1
      const ab = Number.add(5)

      const fab: AsyncResult.AsyncResult<typeof ab> = jest.fn(
        AsyncResult.of(ab),
      )
      const fa: AsyncResult.AsyncResult<typeof a> = jest.fn(AsyncResult.of(a))

      const result1 = await pipe(
        fab,
        AsyncResult.apply(fa),
        AsyncResult.toPromise,
      )
      const result2 = await pipe(
        AsyncResult.apply(fab)(AsyncResult.of(ab => ab(a))),
        AsyncResult.toPromise,
      )

      expect(result1).toEqual(result2)
      expect(fab).toHaveBeenCalledTimes(2)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should return a promise containing `failure` if `failure` was applied to function', async () => {
      const e = 'e'
      const ab = Number.add(5)

      const fab: AsyncResult.AsyncResult<typeof ab> = jest.fn(
        AsyncResult.of(ab),
      )
      const fa: AsyncResult.AsyncResult<never, typeof e> = jest.fn(
        AsyncResult.fail(e),
      )

      const result = await pipe(
        fab,
        AsyncResult.apply(fa),
        AsyncResult.toPromise,
      )

      expect(result).toEqual<Result.Result<never, typeof e>>(Result.fail(e))
      expect(fab).toHaveBeenCalledTimes(1)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should return a promise containing `failure` if value was applied to `failure`', async () => {
      const e = 'e'
      const a = 1

      const fab: AsyncResult.AsyncResult<never, typeof e> = jest.fn(
        AsyncResult.fail(e),
      )
      const fa: AsyncResult.AsyncResult<typeof a, typeof e> = jest.fn(
        AsyncResult.of(a),
      )

      const result = await pipe(
        fab,
        AsyncResult.apply(fa),
        AsyncResult.toPromise,
      )

      expect(result).toEqual<Result.Result<never, typeof e>>(Result.fail(e))
      expect(fab).toHaveBeenCalledTimes(1)
      expect(fa).toHaveBeenCalledTimes(0)
    })

    it('should return a promise containing `failure` if `failure` is applying to `failure`', async () => {
      const e = 'e'
      const d = 'd'
      const fab: AsyncResult.AsyncResult<never, typeof d> = jest.fn(
        AsyncResult.fail(d),
      )
      const fa: AsyncResult.AsyncResult<never, typeof e> = jest.fn(
        AsyncResult.fail(e),
      )

      const result: Result.Result<unknown, typeof e | typeof d> = await pipe(
        fab,
        AsyncResult.apply(fa),
        AsyncResult.toPromise,
      )

      expect(result).toEqual<Result.Result<never, typeof d>>(Result.fail(d))
      expect(fab).toHaveBeenCalledTimes(1)
      expect(fa).toHaveBeenCalledTimes(0)
    })
  })
})
