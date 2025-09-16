import { identity, number, pipe, sync } from "../../../src"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", () => {
      const a = 1
      const fa: sync.Sync<typeof a> = jest.fn (sync.of (a))

      const result = sync.execute (sync.map (identity.identity) (fa))
      expect (result).toEqual (a)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", () => {
      const ab = number.add (5)
      const bc = number.divide (2)

      const a = 1
      const getFa = () => sync.of<typeof a> (a)

      const fa1: sync.Sync<typeof a> = jest.fn (getFa ())
      const fa2: sync.Sync<typeof a> = jest.fn (getFa ())

      const result1 = pipe (
        fa1,
        sync.map (a => bc (ab (a))),
        sync.execute,
      )
      const result2 = pipe (fa2, sync.map (ab), sync.map (bc), sync.execute)

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })
  })
})
