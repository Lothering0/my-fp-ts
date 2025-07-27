import * as syncOption from "../../../src/modules/SyncOption"
import * as option from "../../../src/modules/Option"
import * as number from "../../../src/modules/Number"
import { identity } from "../../../src/modules/Identity"
import { pipe } from "../../../src/utils/flow"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", () => {
      const x = 1
      const fa: syncOption.SyncOption<typeof x> = jest.fn (syncOption.of (x))

      const result = pipe (fa, syncOption.map (identity), syncOption.execute)
      expect (result).toEqual<option.Option<typeof x>> (option.some (x))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", () => {
      const ab = number.add (5)
      const bc = number.divide (2)

      const x = 1
      const getFa = () => syncOption.of<typeof x> (x)

      const fa1: syncOption.SyncOption<typeof x> = jest.fn (getFa ())
      const fa2: syncOption.SyncOption<typeof x> = jest.fn (getFa ())

      const result1 = pipe (
        fa1,
        syncOption.map (a => bc (ab (a))),
        syncOption.execute,
      )
      const result2 = pipe (
        fa2,
        syncOption.map (ab),
        syncOption.map (bc),
        syncOption.execute,
      )

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `none` if the same was provided", () => {
      const n = 1
      const fa: syncOption.SyncOption<never> = jest.fn (syncOption.none)
      const result = pipe (fa, syncOption.map (number.add (n)), syncOption.execute)
      expect (result).toEqual<option.Option<never>> (option.none)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `some` if it was provided", () => {
      const x = 1
      const n = 1
      const fa: syncOption.SyncOption<typeof x> = jest.fn (syncOption.some (x))
      const result = pipe (fa, syncOption.map (number.add (n)), syncOption.execute)
      expect (result).toEqual (option.some (number.add (x) (n)))
      expect (fa).toHaveBeenCalledTimes (1)
    })
  })
})
