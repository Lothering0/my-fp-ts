import * as SR from "../../../src/modules/SyncResult"
import * as R from "../../../src/modules/Result"
import * as N from "../../../src/modules/Number"
import { identity } from "../../../src/modules/Identity"
import { pipe } from "../../../src/utils/flow"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", () => {
      const x = 1
      const fa: SR.SyncResult<never, number> = jest.fn (SR.of (x))

      const result = pipe (SR.map (fa, identity), SR.execute)
      expect (result).toEqual (R.success (x))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", () => {
      const ab = N.add (5)
      const bc = N.divide (2)

      const x = 1
      const getFa = () => SR.of<never, typeof x> (x)

      const fa1: SR.SyncResult<never, typeof x> = jest.fn (getFa ())
      const fa2: SR.SyncResult<never, typeof x> = jest.fn (getFa ())

      const result1 = pipe (
        SR.map (fa1, a => bc (ab (a))),
        SR.execute,
      )
      const result2 = pipe (SR.map (SR.map (fa2, ab), bc), SR.execute)

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `failure` if the same was provided", () => {
      const x = 1
      const n = 1
      const fe: SR.SyncResult<typeof x, never> = jest.fn (SR.failure (x))
      const result = pipe (SR.map (fe, N.add (n)), SR.execute)
      expect (result).toEqual (R.failure (x))
      expect (fe).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `success` if it was provided", () => {
      const x = 1
      const n = 1
      const fa: SR.SyncResult<never, typeof x> = jest.fn (SR.success (x))
      const result = pipe (SR.map (fa, N.add (n)), SR.execute)
      expect (result).toEqual (R.success (N.add (x, n)))
      expect (fa).toHaveBeenCalledTimes (1)
    })
  })
})
