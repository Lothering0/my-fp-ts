import { asyncOption, identity, number, option, pipe } from "../../../src"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", async () => {
      const a = 1
      const fa: asyncOption.AsyncOption<typeof a> = jest.fn (asyncOption.of (a))

      const result = await pipe (
        fa,
        asyncOption.map (identity),
        asyncOption.toPromise,
      )
      expect (result).toEqual<option.Option<typeof a>> (option.some (a))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", async () => {
      const ab = number.add (5)
      const bc = number.divide (2)

      const a = 1
      const getFa = () => asyncOption.of<typeof a> (a)

      const fa1: asyncOption.AsyncOption<typeof a> = jest.fn (getFa ())
      const fa2: asyncOption.AsyncOption<typeof a> = jest.fn (getFa ())

      const result1 = await pipe (
        fa1,
        asyncOption.map (a => bc (ab (a))),
        asyncOption.toPromise,
      )
      const result2 = await pipe (
        fa2,
        asyncOption.map (ab),
        asyncOption.map (bc),
        asyncOption.toPromise,
      )

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing promise of `none` if the same was provided", async () => {
      const n = 1
      const fa: asyncOption.AsyncOption<never> = jest.fn (asyncOption.none)
      const result = await pipe (
        fa,
        asyncOption.map (number.add (n)),
        asyncOption.toPromise,
      )
      expect (result).toEqual<option.Option<never>> (option.none)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing promise of `some` if it was provided", async () => {
      const a = 1
      const n = 1
      const fa: asyncOption.AsyncOption<typeof a> = jest.fn (asyncOption.some (a))
      const result = await pipe (
        fa,
        asyncOption.map (number.add (n)),
        asyncOption.toPromise,
      )
      expect (result).toEqual (option.some (number.add (a) (n)))
      expect (fa).toHaveBeenCalledTimes (1)
    })
  })
})
