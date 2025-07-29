import * as sync from "../../../src/modules/Sync"
import * as number from "../../../src/modules/Number"
import { identity } from "../../../src/modules/Identity"
import { pipe } from "../../../src/utils/flow"

describe ("applicative", () => {
  describe ("ap", () => {
    it ("should satisfy identity law", () => {
      const a = 1
      const fa: sync.Sync<typeof a> = jest.fn (sync.of (a))

      const result = pipe (identity, sync.of, sync.ap (fa), sync.execute)

      expect (result).toEqual (a)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy homomorphism law", () => {
      const a = 1
      const ab = number.add (5)

      const fa: sync.Sync<typeof a> = jest.fn (sync.of (a))
      const fab: sync.Sync<typeof ab> = jest.fn (sync.of (ab))

      const result1 = pipe (fab, sync.ap (fa), sync.execute)
      const result2 = pipe (a, ab, sync.of, sync.execute)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy interchange law", () => {
      const a = 1
      const ab = number.add (5)

      const fa: sync.Sync<typeof a> = jest.fn (sync.of (a))
      const fab: sync.Sync<typeof ab> = jest.fn (sync.of (ab))

      const result1 = pipe (fab, sync.ap (fa), sync.execute)
      const result2 = pipe (sync.ap (fab) (sync.of (ab => ab (a))), sync.execute)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (2)
    })
  })
})
