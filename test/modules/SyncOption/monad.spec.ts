import * as syncOption from "../../../src/modules/SyncOption"
import * as option from "../../../src/modules/Option"
import { flow, pipe } from "../../../src/utils/flow"

describe ("monad", () => {
  describe ("flatMap", () => {
    it ("should satisfy left identity law", () => {
      const a = 1
      const fa: syncOption.SyncOption<typeof a> = jest.fn (syncOption.of (a))
      const afb = (x: number) => syncOption.of (x + 1)

      const result1 = pipe (fa, syncOption.flatMap (afb), syncOption.execute)
      const result2 = pipe (a, afb, syncOption.execute)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy right identity law", () => {
      const a = 1
      const fa: syncOption.SyncOption<typeof a> = jest.fn (syncOption.of (a))

      const result1 = pipe (
        fa,
        syncOption.flatMap (syncOption.of),
        syncOption.execute,
      )
      const result2 = pipe (fa, syncOption.execute)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (2)
    })

    it ("should satisfy associativity law", () => {
      const a = 1
      const fa: syncOption.SyncOption<typeof a> = jest.fn (syncOption.of (a))
      const afb = (x: number) => syncOption.of (x + 1)
      const bfc = (x: number) => syncOption.of (x / 2)

      const result1 = pipe (
        fa,
        syncOption.flatMap (afb),
        syncOption.flatMap (bfc),
        syncOption.execute,
      )
      const result2 = pipe (
        fa,
        syncOption.flatMap (flow (afb, syncOption.flatMap (bfc))),
        syncOption.execute,
      )

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (2)
    })

    it ("should return function containing `none` if the same was provided", () => {
      const fa: syncOption.SyncOption<number> = jest.fn (syncOption.none)
      const result = pipe (
        fa,
        syncOption.flatMap (a => syncOption.some (a + 2)),
        syncOption.execute,
      )
      expect (result).toEqual<option.Option<never>> (option.none)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `none` if the same was returned by callback function", () => {
      const a = 1
      const fa: syncOption.SyncOption<number> = jest.fn (syncOption.some (a))
      const result = pipe (
        fa,
        syncOption.flatMap (syncOption.zero),
        syncOption.execute,
      )
      expect (result).toEqual<option.Option<never>> (option.none)
      expect (fa).toHaveBeenCalledTimes (1)
    })
  })
})
