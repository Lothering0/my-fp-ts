import { identity, Number, Option, pipe, SyncOption } from '../../../src'

describe('functor', () => {
  describe('map', () => {
    it('should satisfy identity law', () => {
      const a = 1
      const fa: SyncOption.SyncOption<typeof a> = jest.fn(SyncOption.of(a))

      const result = pipe(fa, SyncOption.map(identity), SyncOption.execute)
      expect(result).toEqual<Option.Option<typeof a>>(Option.some(a))
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy composition law', () => {
      const ab = Number.add(5)
      const bc = Number.divide(2)

      const a = 1
      const getFa = () => SyncOption.of<typeof a>(a)

      const fa1: SyncOption.SyncOption<typeof a> = jest.fn(getFa())
      const fa2: SyncOption.SyncOption<typeof a> = jest.fn(getFa())

      const result1 = pipe(
        fa1,
        SyncOption.map(a => bc(ab(a))),
        SyncOption.execute,
      )
      const result2 = pipe(
        fa2,
        SyncOption.map(ab),
        SyncOption.map(bc),
        SyncOption.execute,
      )

      expect(result1).toEqual(result2)
      expect(fa1).toHaveBeenCalledTimes(1)
      expect(fa2).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `none` if the same was provided', () => {
      const n = 1
      const fa: SyncOption.SyncOption<never> = jest.fn(SyncOption.none())
      const result = pipe(fa, SyncOption.map(Number.add(n)), SyncOption.execute)
      expect(result).toEqual<Option.Option<never>>(Option.none())
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `some` if it was provided', () => {
      const a = 1
      const n = 1
      const fa: SyncOption.SyncOption<typeof a> = jest.fn(SyncOption.some(a))
      const result = pipe(fa, SyncOption.map(Number.add(n)), SyncOption.execute)
      expect(result).toEqual(Option.some(Number.add(a)(n)))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })
})
