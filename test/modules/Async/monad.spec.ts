import * as async from "../../../src/modules/Async"
import { flow, pipe } from "../../../src/utils/flow"

describe ("monad", () => {
  describe ("flatMap", () => {
    it ("should satisfy left identity law", async () => {
      const a = 1
      const fa: async.Async<typeof a> = jest.fn (async.of (a))
      const afb = (x: number) => async.of (x + 1)

      const result1 = await pipe (fa, async.flatMap (afb), async.toPromise)
      const result2 = await pipe (a, afb, async.toPromise)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy right identity law", async () => {
      const a = 1
      const fa: async.Async<typeof a> = jest.fn (async.of (a))

      const result1 = await pipe (fa, async.flatMap (async.of), async.toPromise)
      const result2 = await pipe (fa, async.toPromise)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (2)
    })

    it ("should satisfy associativity law", async () => {
      const a = 1
      const fa: async.Async<typeof a> = jest.fn (async.of (a))
      const afb = (x: number) => async.of (x + 1)
      const bfc = (x: number) => async.of (x / 2)

      const result1 = await pipe (
        fa,
        async.flatMap (afb),
        async.flatMap (bfc),
        async.toPromise,
      )
      const result2 = await pipe (
        fa,
        async.flatMap (flow (afb, async.flatMap (bfc))),
        async.toPromise,
      )

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (2)
    })
  })
})
