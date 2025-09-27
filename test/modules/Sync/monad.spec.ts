import { flow, pipe, Sync } from '../../../src'

describe('monad', () => {
  describe('flatMap', () => {
    it('should satisfy left identity law', () => {
      const a = 1
      const fa: Sync.Sync<typeof a> = jest.fn(Sync.of(a))
      const afb = (x: number) => Sync.of(x + 1)

      const result1 = pipe(fa, Sync.flatMap(afb), Sync.execute)
      const result2 = pipe(a, afb, Sync.execute)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy right identity law', () => {
      const a = 1
      const fa: Sync.Sync<typeof a> = jest.fn(Sync.of(a))

      const result1 = pipe(fa, Sync.flatMap(Sync.of), Sync.execute)
      const result2 = pipe(fa, Sync.execute)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })

    it('should satisfy associativity law', () => {
      const a = 1
      const fa: Sync.Sync<typeof a> = jest.fn(Sync.of(a))
      const afb = (x: number) => Sync.of(x + 1)
      const bfc = (x: number) => Sync.of(x / 2)

      const result1 = pipe(
        fa,
        Sync.flatMap(afb),
        Sync.flatMap(bfc),
        Sync.execute,
      )
      const result2 = pipe(
        fa,
        Sync.flatMap(flow(afb, Sync.flatMap(bfc))),
        Sync.execute,
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })
  })
})
