import { identity, Number, pipe, Result, SyncResult } from '../../../src'

describe('functor', () => {
  describe('map', () => {
    it('should satisfy identity law', () => {
      const a = 1
      const fa: SyncResult.SyncResult<number> = jest.fn(SyncResult.of(a))

      const result = pipe(fa, SyncResult.map(identity), SyncResult.run)
      expect(result).toEqual(Result.succeed(a))
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy composition law', () => {
      const ab = Number.add(5)
      const bc = Number.divide(2)

      const a = 1
      const getFa = () => SyncResult.of<typeof a>(a)

      const fa1: SyncResult.SyncResult<typeof a> = jest.fn(getFa())
      const fa2: SyncResult.SyncResult<typeof a> = jest.fn(getFa())

      const result1 = pipe(
        fa1,
        SyncResult.map(a => bc(ab(a))),
        SyncResult.run,
      )
      const result2 = pipe(
        fa2,
        SyncResult.map(ab),
        SyncResult.map(bc),
        SyncResult.run,
      )

      expect(result1).toEqual(result2)
      expect(fa1).toHaveBeenCalledTimes(1)
      expect(fa2).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `failure` if the same was provided', () => {
      const a = 1
      const n = 1
      const fe: SyncResult.SyncResult<never, typeof a> = jest.fn(
        SyncResult.fail(a),
      )
      const result = pipe(fe, SyncResult.map(Number.add(n)), SyncResult.run)
      expect(result).toEqual(Result.fail(a))
      expect(fe).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `success` if it was provided', () => {
      const a = 1
      const n = 1
      const fa: SyncResult.SyncResult<typeof a> = jest.fn(SyncResult.succeed(a))
      const result = pipe(fa, SyncResult.map(Number.add(n)), SyncResult.run)
      expect(result).toEqual(Result.succeed(Number.add(a)(n)))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })
})
