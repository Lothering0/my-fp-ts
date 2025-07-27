import * as asyncOption from "../../../src/modules/AsyncOption"
import * as option from "../../../src/modules/Option"
import * as number from "../../../src/modules/Number"
import { identity } from "../../../src/modules/Identity"
import { pipe } from "../../../src/utils/flow"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", async () => {
      const x = 1
      const fa: asyncOption.AsyncOption<typeof x> = jest.fn (asyncOption.of (x))

      const result = await pipe (
        fa,
        asyncOption.map (identity),
        asyncOption.toPromise,
      )
      expect (result).toEqual<option.Option<typeof x>> (option.some (x))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", async () => {
      const ab = number.add (5)
      const bc = number.divide (2)

      const x = 1
      const getFa = () => asyncOption.of<typeof x> (x)

      const fa1: asyncOption.AsyncOption<typeof x> = jest.fn (getFa ())
      const fa2: asyncOption.AsyncOption<typeof x> = jest.fn (getFa ())

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
      const x = 1
      const n = 1
      const fa: asyncOption.AsyncOption<typeof x> = jest.fn (asyncOption.some (x))
      const result = await pipe (
        fa,
        asyncOption.map (number.add (n)),
        asyncOption.toPromise,
      )
      expect (result).toEqual (option.some (number.add (x) (n)))
      expect (fa).toHaveBeenCalledTimes (1)
    })
  })
})
