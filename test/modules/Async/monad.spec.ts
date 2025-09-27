import { Async, flow, pipe } from '../../../src'

describe('monad', () => {
  describe('flatMap', () => {
    it('should satisfy left identity law', async () => {
      const a = 1
      const fa: Async.Async<typeof a> = jest.fn(Async.of(a))
      const afb = (x: number) => Async.of(x + 1)

      const result1 = await pipe(fa, Async.flatMap(afb), Async.toPromise)
      const result2 = await pipe(a, afb, Async.toPromise)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy right identity law', async () => {
      const a = 1
      const fa: Async.Async<typeof a> = jest.fn(Async.of(a))

      const result1 = await pipe(fa, Async.flatMap(Async.of), Async.toPromise)
      const result2 = await pipe(fa, Async.toPromise)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })

    it('should satisfy associativity law', async () => {
      const a = 1
      const fa: Async.Async<typeof a> = jest.fn(Async.of(a))
      const afb = (x: number) => Async.of(x + 1)
      const bfc = (x: number) => Async.of(x / 2)

      const result1 = await pipe(
        fa,
        Async.flatMap(afb),
        Async.flatMap(bfc),
        Async.toPromise,
      )
      const result2 = await pipe(
        fa,
        Async.flatMap(flow(afb, Async.flatMap(bfc))),
        Async.toPromise,
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })
  })
})
