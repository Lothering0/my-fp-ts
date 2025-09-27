import { identity, Number, pipe, Sync } from '../../../src'

describe('functor', () => {
  describe('map', () => {
    it('should satisfy identity law', () => {
      const a = 1
      const fa: Sync.Sync<typeof a> = jest.fn(Sync.of(a))

      const result = Sync.execute(Sync.map(identity)(fa))
      expect(result).toEqual(a)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy composition law', () => {
      const ab = Number.add(5)
      const bc = Number.divide(2)

      const a = 1
      const getFa = () => Sync.of<typeof a>(a)

      const fa1: Sync.Sync<typeof a> = jest.fn(getFa())
      const fa2: Sync.Sync<typeof a> = jest.fn(getFa())

      const result1 = pipe(
        fa1,
        Sync.map(a => bc(ab(a))),
        Sync.execute,
      )
      const result2 = pipe(fa2, Sync.map(ab), Sync.map(bc), Sync.execute)

      expect(result1).toEqual(result2)
      expect(fa1).toHaveBeenCalledTimes(1)
      expect(fa2).toHaveBeenCalledTimes(1)
    })
  })
})
