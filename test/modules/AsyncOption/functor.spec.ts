import { AsyncOption, identity, Number, Option, pipe } from '../../../src'

describe('functor', () => {
  describe('map', () => {
    it('should satisfy identity law', async () => {
      const a = 1
      const fa: AsyncOption.AsyncOption<typeof a> = jest.fn(AsyncOption.of(a))

      const result = await pipe(
        fa,
        AsyncOption.map(identity),
        AsyncOption.toPromise,
      )
      expect(result).toEqual<Option.Option<typeof a>>(Option.some(a))
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy composition law', async () => {
      const ab = Number.add(5)
      const bc = Number.divide(2)

      const a = 1
      const getFa = () => AsyncOption.of<typeof a>(a)

      const fa1: AsyncOption.AsyncOption<typeof a> = jest.fn(getFa())
      const fa2: AsyncOption.AsyncOption<typeof a> = jest.fn(getFa())

      const result1 = await pipe(
        fa1,
        AsyncOption.map(a => bc(ab(a))),
        AsyncOption.toPromise,
      )
      const result2 = await pipe(
        fa2,
        AsyncOption.map(ab),
        AsyncOption.map(bc),
        AsyncOption.toPromise,
      )

      expect(result1).toEqual(result2)
      expect(fa1).toHaveBeenCalledTimes(1)
      expect(fa2).toHaveBeenCalledTimes(1)
    })

    it('should return function containing promise of `none` if the same was provided', async () => {
      const n = 1
      const fa: AsyncOption.AsyncOption<never> = jest.fn(AsyncOption.none())
      const result = await pipe(
        fa,
        AsyncOption.map(Number.add(n)),
        AsyncOption.toPromise,
      )
      expect(result).toEqual<Option.Option<never>>(Option.none())
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should return function containing promise of `some` if it was provided', async () => {
      const a = 1
      const n = 1
      const fa: AsyncOption.AsyncOption<typeof a> = jest.fn(AsyncOption.some(a))
      const result = await pipe(
        fa,
        AsyncOption.map(Number.add(n)),
        AsyncOption.toPromise,
      )
      expect(result).toEqual(Option.some(Number.add(a)(n)))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })
})
