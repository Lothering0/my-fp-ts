import * as sync from "../../../src/modules/Sync"
import { flow, pipe } from "../../../src/utils/flow"

describe ("monad", () => {
  describe ("flatMap", () => {
    it ("should satisfy left identity law", () => {
      const a = 1
      const fa: sync.Sync<typeof a> = jest.fn (sync.of (a))
      const afb = (x: number) => sync.of (x + 1)

      const result1 = pipe (fa, sync.flatMap (afb), sync.execute)
      const result2 = pipe (a, afb, sync.execute)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy right identity law", () => {
      const a = 1
      const fa: sync.Sync<typeof a> = jest.fn (sync.of (a))

      const result1 = pipe (fa, sync.flatMap (sync.of), sync.execute)
      const result2 = pipe (fa, sync.execute)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (2)
    })

    it ("should satisfy associativity law", () => {
      const a = 1
      const fa: sync.Sync<typeof a> = jest.fn (sync.of (a))
      const afb = (x: number) => sync.of (x + 1)
      const bfc = (x: number) => sync.of (x / 2)

      const result1 = pipe (
        fa,
        sync.flatMap (afb),
        sync.flatMap (bfc),
        sync.execute,
      )
      const result2 = pipe (
        fa,
        sync.flatMap (flow (afb, sync.flatMap (bfc))),
        sync.execute,
      )

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (2)
    })
  })
})
