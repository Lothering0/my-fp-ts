import { async, identity, number, pipe } from '../../../src'

describe('applicative', () => {
  describe('ap', () => {
    it('should satisfy identity law', async () => {
      const a = 1
      const fa: async.Async<typeof a> = jest.fn(async.of(a))

      const result = await pipe(
        identity,
        async.of,
        async.ap(fa),
        async.toPromise,
      )

      expect(result).toEqual(a)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy homomorphism law', async () => {
      const a = 1
      const ab = number.add(5)

      const fa: async.Async<typeof a> = jest.fn(async.of(a))
      const fab: async.Async<typeof ab> = jest.fn(async.of(ab))

      const result1 = await pipe(fab, async.ap(fa), async.toPromise)
      const result2 = await pipe(a, ab, async.of, async.toPromise)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should satisfy interchange law', async () => {
      const a = 1
      const ab = number.add(5)

      const fa: async.Async<typeof a> = jest.fn(async.of(a))
      const fab: async.Async<typeof ab> = jest.fn(async.of(ab))

      const result1 = await pipe(fab, async.ap(fa), async.toPromise)
      const result2 = await pipe(
        async.ap(fab)(async.of(ab => ab(a))),
        async.toPromise,
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(2)
    })
  })
})
