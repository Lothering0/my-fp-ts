import * as A from "../../../src/modules/Async"
import { identity } from "../../../src/modules/Identity"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", async () => {
      const x = 1
      const fa: A.Async<number> = jest.fn ().mockImplementation (A.of (x))

      const result = await A.fromAsync (A.map (fa, identity))
      expect (result).toEqual (x)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", async () => {
      const ab: {
        (n: number): number
      } = n => n + 5
      const bc: {
        (n: number): number
      } = n => n / 2

      const x = 1
      const getFa = () => A.of (x)

      const fa1: A.Async<number> = jest.fn ().mockImplementation (getFa ())
      const fa2: A.Async<number> = jest.fn ().mockImplementation (getFa ())

      const result1 = await A.fromAsync (A.map (fa1, a => bc (ab (a))))
      const result2 = await A.fromAsync (A.map (A.map (fa2, ab), bc))

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })
  })
})
