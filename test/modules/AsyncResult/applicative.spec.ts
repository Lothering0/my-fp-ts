import { asyncResult, identity, number, pipe, result } from '../../../src'

describe('applicative', () => {
  describe('ap', () => {
    it('should satisfy identity law', async () => {
      const a = 1
      const fa: asyncResult.AsyncResult<never, typeof a> = jest.fn(
        asyncResult.of(a),
      )

      const result_ = await pipe(
        identity,
        asyncResult.of,
        asyncResult.ap(fa),
        asyncResult.toPromise,
      )

      expect(result_).toEqual<result.Result<never, typeof a>>(result.succeed(a))
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy homomorphism law', async () => {
      const a = 1
      const ab = number.add(5)

      const fa: asyncResult.AsyncResult<never, typeof a> = jest.fn(
        asyncResult.of(a),
      )
      const fab: asyncResult.AsyncResult<never, typeof ab> = jest.fn(
        asyncResult.of(ab),
      )

      const result1 = await pipe(fab, asyncResult.ap(fa), asyncResult.toPromise)
      const result2 = await pipe(a, ab, asyncResult.of, asyncResult.toPromise)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should satisfy interchange law', async () => {
      const a = 1
      const ab = number.add(5)

      const fa: asyncResult.AsyncResult<never, typeof a> = jest.fn(
        asyncResult.of(a),
      )
      const fab: asyncResult.AsyncResult<never, typeof ab> = jest.fn(
        asyncResult.of(ab),
      )

      const result1 = await pipe(fab, asyncResult.ap(fa), asyncResult.toPromise)
      const result2 = await pipe(
        asyncResult.ap(fab)(asyncResult.of(ab => ab(a))),
        asyncResult.toPromise,
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(2)
    })

    it('should return promise containing `failure` if `failure` was applied to function', async () => {
      const e = 'e'
      const ab = number.add(5)

      const fa: asyncResult.AsyncResult<typeof e, never> = jest.fn(
        asyncResult.fail(e),
      )
      const fab: asyncResult.AsyncResult<never, typeof ab> = jest.fn(
        asyncResult.of(ab),
      )

      const result_ = await pipe(fab, asyncResult.ap(fa), asyncResult.toPromise)

      expect(result_).toEqual<result.Result<typeof e, never>>(result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should return promise containing `failure` if value was applied to `failure`', async () => {
      const e = 'e'
      const a = 1

      const fa: asyncResult.AsyncResult<typeof e, typeof a> = jest.fn(
        asyncResult.of(a),
      )
      const fab: asyncResult.AsyncResult<typeof e, never> = jest.fn(
        asyncResult.fail(e),
      )

      const result_ = await pipe(fab, asyncResult.ap(fa), asyncResult.toPromise)

      expect(result_).toEqual<result.Result<typeof e, never>>(result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should return promise containing `failure` if `failure` is applying to `failure`', async () => {
      const e = 'e'
      const d = 'd'
      const fa: asyncResult.AsyncResult<typeof e, never> = jest.fn(
        asyncResult.fail(e),
      )
      const fab: asyncResult.AsyncResult<typeof d, never> = jest.fn(
        asyncResult.fail(d),
      )

      const result_: result.Result<typeof e | typeof d, unknown> = await pipe(
        fab,
        asyncResult.ap(fa),
        asyncResult.toPromise,
      )

      expect(result_).toEqual<result.Result<typeof e, never>>(result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })
  })
})
