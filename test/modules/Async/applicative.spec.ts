import { Async, identity, Number, pipe } from '../../../src'

describe('applicative', () => {
  describe('apply', () => {
    it('should satisfy identity law', async () => {
      const a = 1
      const fa: Async.Async<typeof a> = jest.fn(Async.of(a))

      const result = await pipe(
        identity,
        Async.of,
        Async.apply(fa),
        Async.toPromise,
      )

      expect(result).toEqual(a)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy homomorphism law', async () => {
      const a = 1
      const ab = Number.add(5)

      const fa: Async.Async<typeof a> = jest.fn(Async.of(a))
      const fab: Async.Async<typeof ab> = jest.fn(Async.of(ab))

      const result1 = await pipe(fab, Async.apply(fa), Async.toPromise)
      const result2 = await pipe(a, ab, Async.of, Async.toPromise)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should satisfy interchange law', async () => {
      const a = 1
      const ab = Number.add(5)

      const fa: Async.Async<typeof a> = jest.fn(Async.of(a))
      const fab: Async.Async<typeof ab> = jest.fn(Async.of(ab))

      const result1 = await pipe(fab, Async.apply(fa), Async.toPromise)
      const result2 = await pipe(
        Async.apply(fab)(Async.of(ab => ab(a))),
        Async.toPromise,
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(2)
    })
  })
})
