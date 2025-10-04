import { flow, Option, pipe, SyncOption } from '../../../src'

describe('monad', () => {
  describe('flatMap', () => {
    it('should satisfy left identity law', () => {
      const a = 1
      const fa: SyncOption.SyncOption<typeof a> = jest.fn(SyncOption.of(a))
      const afb = (x: number) => SyncOption.of(x + 1)

      const result1 = pipe(fa, SyncOption.flatMap(afb), SyncOption.execute)
      const result2 = pipe(a, afb, SyncOption.execute)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy right identity law', () => {
      const a = 1
      const fa: SyncOption.SyncOption<typeof a> = jest.fn(SyncOption.of(a))

      const result1 = pipe(
        fa,
        SyncOption.flatMap(SyncOption.of),
        SyncOption.execute,
      )
      const result2 = pipe(fa, SyncOption.execute)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })

    it('should satisfy associativity law', () => {
      const a = 1
      const fa: SyncOption.SyncOption<typeof a> = jest.fn(SyncOption.of(a))
      const afb = (x: number) => SyncOption.of(x + 1)
      const bfc = (x: number) => SyncOption.of(x / 2)

      const result1 = pipe(
        fa,
        SyncOption.flatMap(afb),
        SyncOption.flatMap(bfc),
        SyncOption.execute,
      )
      const result2 = pipe(
        fa,
        SyncOption.flatMap(flow(afb, SyncOption.flatMap(bfc))),
        SyncOption.execute,
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })

    it('should return function containing `none` if the same was provided', () => {
      const fa: SyncOption.SyncOption<number> = jest.fn(SyncOption.none())
      const result = pipe(
        fa,
        SyncOption.flatMap(a => SyncOption.some(a + 2)),
        SyncOption.execute,
      )
      expect(result).toEqual<Option.Option<never>>(Option.none())
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `none` if the same was returned by callback function', () => {
      const a = 1
      const fa: SyncOption.SyncOption<number> = jest.fn(SyncOption.some(a))
      const result = pipe(
        fa,
        SyncOption.flatMap(SyncOption.none),
        SyncOption.execute,
      )
      expect(result).toEqual<Option.Option<never>>(Option.none())
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })
})
