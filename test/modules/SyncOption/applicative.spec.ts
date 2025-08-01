import * as syncOption from "../../../src/modules/SyncOption"
import * as option from "../../../src/modules/Option"
import * as number from "../../../src/modules/Number"
import { identity } from "../../../src/modules/Identity"
import { pipe } from "../../../src/utils/flow"

describe ("applicative", () => {
  describe ("ap", () => {
    it ("should satisfy identity law", () => {
      const a = 1
      const fa: syncOption.SyncOption<typeof a> = jest.fn (syncOption.of (a))

      const result = pipe (
        identity,
        syncOption.of,
        syncOption.ap (fa),
        syncOption.execute,
      )

      expect (result).toEqual<option.Option<typeof a>> (option.some (a))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy homomorphism law", () => {
      const a = 1
      const ab = number.add (5)

      const fa: syncOption.SyncOption<typeof a> = jest.fn (syncOption.of (a))
      const fab: syncOption.SyncOption<typeof ab> = jest.fn (syncOption.of (ab))

      const result1 = pipe (fab, syncOption.ap (fa), syncOption.execute)
      const result2 = pipe (a, ab, syncOption.of, syncOption.execute)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy interchange law", () => {
      const a = 1
      const ab = number.add (5)

      const fa: syncOption.SyncOption<typeof a> = jest.fn (syncOption.of (a))
      const fab: syncOption.SyncOption<typeof ab> = jest.fn (syncOption.of (ab))

      const result1 = pipe (fab, syncOption.ap (fa), syncOption.execute)
      const result2 = pipe (
        syncOption.ap (fab) (syncOption.of (ab => ab (a))),
        syncOption.execute,
      )

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (2)
    })

    it ("should return function containing `none` if `none` was applied to function", () => {
      const ab = number.add (5)

      const fa: syncOption.SyncOption<never> = jest.fn (syncOption.none)
      const fab: syncOption.SyncOption<typeof ab> = jest.fn (syncOption.of (ab))

      const result = pipe (fab, syncOption.ap (fa), syncOption.execute)

      expect (result).toEqual<option.Option<never>> (option.none)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `none` if value was applied to `none`", () => {
      const a = 1

      const fa: syncOption.SyncOption<typeof a> = jest.fn (syncOption.of (a))
      const fab: syncOption.SyncOption<never> = jest.fn (syncOption.none)

      const result = pipe (fab, syncOption.ap (fa), syncOption.execute)

      expect (result).toEqual<option.Option<never>> (option.none)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `none` if `none` was applied to `none`", () => {
      const fa: syncOption.SyncOption<never> = jest.fn (syncOption.none)
      const fab: syncOption.SyncOption<never> = jest.fn (syncOption.none)

      const result = pipe (fab, syncOption.ap (fa), syncOption.execute)

      expect (result).toEqual<option.Option<never>> (option.none)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (1)
    })
  })
})
