import { identity, Number, pipe, Sync } from '../../../src'

describe('applicative', () => {
  describe('apply', () => {
    it('should satisfy identity law', () => {
      const a = 1
      const fa: Sync.Sync<typeof a> = jest.fn(Sync.of(a))

      const result = pipe(identity, Sync.of, Sync.apply(fa), Sync.run)

      expect(result).toEqual(a)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy homomorphism law', () => {
      const a = 1
      const ab = Number.add(5)

      const fa: Sync.Sync<typeof a> = jest.fn(Sync.of(a))
      const fab: Sync.Sync<typeof ab> = jest.fn(Sync.of(ab))

      const result1 = pipe(fab, Sync.apply(fa), Sync.run)
      const result2 = pipe(a, ab, Sync.of, Sync.run)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should satisfy interchange law', () => {
      const a = 1
      const ab = Number.add(5)

      const fa: Sync.Sync<typeof a> = jest.fn(Sync.of(a))
      const fab: Sync.Sync<typeof ab> = jest.fn(Sync.of(ab))

      const result1 = pipe(fab, Sync.apply(fa), Sync.run)
      const result2 = pipe(Sync.apply(fab)(Sync.of(ab => ab(a))), Sync.run)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(2)
    })
  })
})
