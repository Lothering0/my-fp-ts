import { asyncOption, flow, option, pipe } from "../../../src"

describe ("monad", () => {
  describe ("flatMap", () => {
    it ("should satisfy left identity law", async () => {
      const a = 1
      const fa: asyncOption.AsyncOption<typeof a> = jest.fn (asyncOption.of (a))
      const afb = (x: number) => asyncOption.of (x + 1)

      const result1 = await pipe (
        fa,
        asyncOption.flatMap (afb),
        asyncOption.toPromise,
      )
      const result2 = await pipe (a, afb, asyncOption.toPromise)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy right identity law", async () => {
      const a = 1
      const fa: asyncOption.AsyncOption<typeof a> = jest.fn (asyncOption.of (a))

      const result1 = await pipe (
        fa,
        asyncOption.flatMap (asyncOption.of),
        asyncOption.toPromise,
      )
      const result2 = await pipe (fa, asyncOption.toPromise)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (2)
    })

    it ("should satisfy associativity law", async () => {
      const a = 1
      const fa: asyncOption.AsyncOption<typeof a> = jest.fn (asyncOption.of (a))
      const afb = (x: number) => asyncOption.of (x + 1)
      const bfc = (x: number) => asyncOption.of (x / 2)

      const result1 = await pipe (
        fa,
        asyncOption.flatMap (afb),
        asyncOption.flatMap (bfc),
        asyncOption.toPromise,
      )
      const result2 = await pipe (
        fa,
        asyncOption.flatMap (flow (afb, asyncOption.flatMap (bfc))),
        asyncOption.toPromise,
      )

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (2)
    })

    it ("should return function containing `none` if the same was provided", async () => {
      const fa: asyncOption.AsyncOption<number> = jest.fn (asyncOption.none)
      const result = await pipe (
        fa,
        asyncOption.flatMap (a => asyncOption.some (a + 2)),
        asyncOption.toPromise,
      )
      expect (result).toEqual<option.Option<never>> (option.none)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `none` if the same was returned by callback function", async () => {
      const a = 1
      const fa: asyncOption.AsyncOption<number> = jest.fn (asyncOption.some (a))
      const result = await pipe (
        fa,
        asyncOption.flatMap (asyncOption.zero),
        asyncOption.toPromise,
      )
      expect (result).toEqual<option.Option<never>> (option.none)
      expect (fa).toHaveBeenCalledTimes (1)
    })
  })
})
