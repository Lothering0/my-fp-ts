import { AsyncResult, identity, Number, pipe, Result } from '../../../src'

describe('applicative', () => {
  describe('ap', () => {
    it('should satisfy identity law', async () => {
      const a = 1
      const fa: AsyncResult.AsyncResult<never, typeof a> = jest.fn(
        AsyncResult.of(a),
      )

      const result = await pipe(
        identity,
        AsyncResult.of,
        AsyncResult.ap(fa),
        AsyncResult.toPromise,
      )

      expect(result).toEqual<Result.Result<never, typeof a>>(Result.succeed(a))
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy homomorphism law', async () => {
      const a = 1
      const ab = Number.add(5)

      const fa: AsyncResult.AsyncResult<never, typeof a> = jest.fn(
        AsyncResult.of(a),
      )
      const fab: AsyncResult.AsyncResult<never, typeof ab> = jest.fn(
        AsyncResult.of(ab),
      )

      const result1 = await pipe(fab, AsyncResult.ap(fa), AsyncResult.toPromise)
      const result2 = await pipe(a, ab, AsyncResult.of, AsyncResult.toPromise)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should satisfy interchange law', async () => {
      const a = 1
      const ab = Number.add(5)

      const fa: AsyncResult.AsyncResult<never, typeof a> = jest.fn(
        AsyncResult.of(a),
      )
      const fab: AsyncResult.AsyncResult<never, typeof ab> = jest.fn(
        AsyncResult.of(ab),
      )

      const result1 = await pipe(fab, AsyncResult.ap(fa), AsyncResult.toPromise)
      const result2 = await pipe(
        AsyncResult.ap(fab)(AsyncResult.of(ab => ab(a))),
        AsyncResult.toPromise,
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(2)
    })

    it('should return promise containing `failure` if `failure` was applied to function', async () => {
      const e = 'e'
      const ab = Number.add(5)

      const fa: AsyncResult.AsyncResult<typeof e, never> = jest.fn(
        AsyncResult.fail(e),
      )
      const fab: AsyncResult.AsyncResult<never, typeof ab> = jest.fn(
        AsyncResult.of(ab),
      )

      const result = await pipe(fab, AsyncResult.ap(fa), AsyncResult.toPromise)

      expect(result).toEqual<Result.Result<typeof e, never>>(Result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should return promise containing `failure` if value was applied to `failure`', async () => {
      const e = 'e'
      const a = 1

      const fa: AsyncResult.AsyncResult<typeof e, typeof a> = jest.fn(
        AsyncResult.of(a),
      )
      const fab: AsyncResult.AsyncResult<typeof e, never> = jest.fn(
        AsyncResult.fail(e),
      )

      const result = await pipe(fab, AsyncResult.ap(fa), AsyncResult.toPromise)

      expect(result).toEqual<Result.Result<typeof e, never>>(Result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should return promise containing `failure` if `failure` is applying to `failure`', async () => {
      const e = 'e'
      const d = 'd'
      const fa: AsyncResult.AsyncResult<typeof e, never> = jest.fn(
        AsyncResult.fail(e),
      )
      const fab: AsyncResult.AsyncResult<typeof d, never> = jest.fn(
        AsyncResult.fail(d),
      )

      const result: Result.Result<typeof e | typeof d, unknown> = await pipe(
        fab,
        AsyncResult.ap(fa),
        AsyncResult.toPromise,
      )

      expect(result).toEqual<Result.Result<typeof e, never>>(Result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })
  })
})
