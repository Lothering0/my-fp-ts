import { asyncOption, identity, number, option, pipe } from "../../../src"

describe ("applicative", () => {
  describe ("ap", () => {
    it ("should satisfy identity law", async () => {
      const a = 1
      const fa: asyncOption.AsyncOption<typeof a> = jest.fn (asyncOption.of (a))

      const result = await pipe (
        identity.identity,
        asyncOption.of,
        asyncOption.ap (fa),
        asyncOption.toPromise,
      )

      expect (result).toEqual<option.Option<typeof a>> (option.some (a))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy homomorphism law", async () => {
      const a = 1
      const ab = number.add (5)

      const fa: asyncOption.AsyncOption<typeof a> = jest.fn (asyncOption.of (a))
      const fab: asyncOption.AsyncOption<typeof ab> = jest.fn (
        asyncOption.of (ab),
      )

      const result1 = await pipe (fab, asyncOption.ap (fa), asyncOption.toPromise)
      const result2 = await pipe (a, ab, asyncOption.of, asyncOption.toPromise)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy interchange law", async () => {
      const a = 1
      const ab = number.add (5)

      const fa: asyncOption.AsyncOption<typeof a> = jest.fn (asyncOption.of (a))
      const fab: asyncOption.AsyncOption<typeof ab> = jest.fn (
        asyncOption.of (ab),
      )

      const result1 = await pipe (fab, asyncOption.ap (fa), asyncOption.toPromise)
      const result2 = await pipe (
        asyncOption.ap (fab) (asyncOption.of (ab => ab (a))),
        asyncOption.toPromise,
      )

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (2)
    })

    it ("should return promise containing `none` if `none` was applied to function", async () => {
      const ab = number.add (5)

      const fa: asyncOption.AsyncOption<never> = jest.fn (asyncOption.none)
      const fab: asyncOption.AsyncOption<typeof ab> = jest.fn (
        asyncOption.of (ab),
      )

      const result = await pipe (fab, asyncOption.ap (fa), asyncOption.toPromise)

      expect (result).toEqual<option.Option<never>> (option.none)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (1)
    })

    it ("should return promise containing `none` if value was applied to `none`", async () => {
      const a = 1

      const fa: asyncOption.AsyncOption<typeof a> = jest.fn (asyncOption.of (a))
      const fab: asyncOption.AsyncOption<never> = jest.fn (asyncOption.none)

      const result = await pipe (fab, asyncOption.ap (fa), asyncOption.toPromise)

      expect (result).toEqual<option.Option<never>> (option.none)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (1)
    })

    it ("should return promise containing `none` if `none` was applied to `none`", async () => {
      const fa: asyncOption.AsyncOption<never> = jest.fn (asyncOption.none)
      const fab: asyncOption.AsyncOption<never> = jest.fn (asyncOption.none)

      const result = await pipe (fab, asyncOption.ap (fa), asyncOption.toPromise)

      expect (result).toEqual<option.Option<never>> (option.none)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (1)
    })
  })
})
