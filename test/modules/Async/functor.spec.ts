import { Async, identity, Number, pipe } from '../../../src'

describe('functor', () => {
  describe('map', () => {
    it('should satisfy identity law', async () => {
      const a = 1
      const fa: Async.Async<typeof a> = jest.fn(Async.of(a))

      const result = await pipe(fa, Async.map(identity), Async.toPromise)
      expect(result).toEqual(a)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy composition law', async () => {
      const ab = Number.add(5)
      const bc = Number.divide(2)

      const a = 1
      const getFa = () => Async.of<typeof a>(a)

      const fa1: Async.Async<typeof a> = jest.fn(getFa())
      const fa2: Async.Async<typeof a> = jest.fn(getFa())

      const result1 = await pipe(
        fa1,
        Async.map(a => bc(ab(a))),
        Async.toPromise,
      )
      const result2 = await pipe(
        fa2,
        Async.map(ab),
        Async.map(bc),
        Async.toPromise,
      )

      expect(result1).toEqual(result2)
      expect(fa1).toHaveBeenCalledTimes(1)
      expect(fa2).toHaveBeenCalledTimes(1)
    })
  })
})
