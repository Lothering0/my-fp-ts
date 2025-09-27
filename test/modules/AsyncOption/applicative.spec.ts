import { AsyncOption, identity, Number, Option, pipe } from '../../../src'

describe('applicative', () => {
  describe('ap', () => {
    it('should satisfy identity law', async () => {
      const a = 1
      const fa: AsyncOption.AsyncOption<typeof a> = jest.fn(AsyncOption.of(a))

      const result = await pipe(
        identity,
        AsyncOption.of,
        AsyncOption.ap(fa),
        AsyncOption.toPromise,
      )

      expect(result).toEqual<Option.Option<typeof a>>(Option.some(a))
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy homomorphism law', async () => {
      const a = 1
      const ab = Number.add(5)

      const fa: AsyncOption.AsyncOption<typeof a> = jest.fn(AsyncOption.of(a))
      const fab: AsyncOption.AsyncOption<typeof ab> = jest.fn(
        AsyncOption.of(ab),
      )

      const result1 = await pipe(fab, AsyncOption.ap(fa), AsyncOption.toPromise)
      const result2 = await pipe(a, ab, AsyncOption.of, AsyncOption.toPromise)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should satisfy interchange law', async () => {
      const a = 1
      const ab = Number.add(5)

      const fa: AsyncOption.AsyncOption<typeof a> = jest.fn(AsyncOption.of(a))
      const fab: AsyncOption.AsyncOption<typeof ab> = jest.fn(
        AsyncOption.of(ab),
      )

      const result1 = await pipe(fab, AsyncOption.ap(fa), AsyncOption.toPromise)
      const result2 = await pipe(
        AsyncOption.ap(fab)(AsyncOption.of(ab => ab(a))),
        AsyncOption.toPromise,
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(2)
    })

    it('should return promise containing `none` if `none` was applied to function', async () => {
      const ab = Number.add(5)

      const fa: AsyncOption.AsyncOption<never> = jest.fn(AsyncOption.none)
      const fab: AsyncOption.AsyncOption<typeof ab> = jest.fn(
        AsyncOption.of(ab),
      )

      const result = await pipe(fab, AsyncOption.ap(fa), AsyncOption.toPromise)

      expect(result).toEqual<Option.Option<never>>(Option.none)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should return promise containing `none` if value was applied to `none`', async () => {
      const a = 1

      const fa: AsyncOption.AsyncOption<typeof a> = jest.fn(AsyncOption.of(a))
      const fab: AsyncOption.AsyncOption<never> = jest.fn(AsyncOption.none)

      const result = await pipe(fab, AsyncOption.ap(fa), AsyncOption.toPromise)

      expect(result).toEqual<Option.Option<never>>(Option.none)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should return promise containing `none` if `none` was applied to `none`', async () => {
      const fa: AsyncOption.AsyncOption<never> = jest.fn(AsyncOption.none)
      const fab: AsyncOption.AsyncOption<never> = jest.fn(AsyncOption.none)

      const result = await pipe(fab, AsyncOption.ap(fa), AsyncOption.toPromise)

      expect(result).toEqual<Option.Option<never>>(Option.none)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })
  })
})
