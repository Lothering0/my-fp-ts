import { async, identity, number, pipe } from "../../../src"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", async () => {
      const a = 1
      const fa: async.Async<typeof a> = jest.fn (async.of (a))

      const result = await pipe (fa, async.map (identity), async.toPromise)
      expect (result).toEqual (a)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", async () => {
      const ab = number.add (5)
      const bc = number.divide (2)

      const a = 1
      const getFa = () => async.of<typeof a> (a)

      const fa1: async.Async<typeof a> = jest.fn (getFa ())
      const fa2: async.Async<typeof a> = jest.fn (getFa ())

      const result1 = await pipe (
        fa1,
        async.map (a => bc (ab (a))),
        async.toPromise,
      )
      const result2 = await pipe (
        fa2,
        async.map (ab),
        async.map (bc),
        async.toPromise,
      )

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })
  })
})
