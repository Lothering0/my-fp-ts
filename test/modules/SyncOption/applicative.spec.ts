import { identity, Number, Option, pipe, SyncOption } from '../../../src'

describe('applicative', () => {
  describe('apply', () => {
    it('should satisfy identity law', () => {
      const a = 1
      const fa: SyncOption.SyncOption<typeof a> = jest.fn(SyncOption.of(a))

      const result = pipe(
        identity,
        SyncOption.of,
        SyncOption.apply(fa),
        SyncOption.execute,
      )

      expect(result).toEqual<Option.Option<typeof a>>(Option.some(a))
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy homomorphism law', () => {
      const a = 1
      const ab = Number.add(5)

      const fa: SyncOption.SyncOption<typeof a> = jest.fn(SyncOption.of(a))
      const fab: SyncOption.SyncOption<typeof ab> = jest.fn(SyncOption.of(ab))

      const result1 = pipe(fab, SyncOption.apply(fa), SyncOption.execute)
      const result2 = pipe(a, ab, SyncOption.of, SyncOption.execute)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should satisfy interchange law', () => {
      const a = 1
      const ab = Number.add(5)

      const fa: SyncOption.SyncOption<typeof a> = jest.fn(SyncOption.of(a))
      const fab: SyncOption.SyncOption<typeof ab> = jest.fn(SyncOption.of(ab))

      const result1 = pipe(fab, SyncOption.apply(fa), SyncOption.execute)
      const result2 = pipe(
        SyncOption.apply(fab)(SyncOption.of(ab => ab(a))),
        SyncOption.execute,
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(2)
    })

    it('should return function containing `none` if `none` was applied to function', () => {
      const ab = Number.add(5)

      const fa: SyncOption.SyncOption<never> = jest.fn(SyncOption.none)
      const fab: SyncOption.SyncOption<typeof ab> = jest.fn(SyncOption.of(ab))

      const result = pipe(fab, SyncOption.apply(fa), SyncOption.execute)

      expect(result).toEqual<Option.Option<never>>(Option.none)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `none` if value was applied to `none`', () => {
      const a = 1

      const fa: SyncOption.SyncOption<typeof a> = jest.fn(SyncOption.of(a))
      const fab: SyncOption.SyncOption<never> = jest.fn(SyncOption.none)

      const result = pipe(fab, SyncOption.apply(fa), SyncOption.execute)

      expect(result).toEqual<Option.Option<never>>(Option.none)
      expect(fa).toHaveBeenCalledTimes(0)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `none` if `none` was applied to `none`', () => {
      const fa: SyncOption.SyncOption<never> = jest.fn(SyncOption.none)
      const fab: SyncOption.SyncOption<never> = jest.fn(SyncOption.none)

      const result = pipe(fab, SyncOption.apply(fa), SyncOption.execute)

      expect(result).toEqual<Option.Option<never>>(Option.none)
      expect(fa).toHaveBeenCalledTimes(0)
      expect(fab).toHaveBeenCalledTimes(1)
    })
  })
})
