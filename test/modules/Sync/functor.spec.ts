import * as S from "../../../src/modules/Sync"
import { identity } from "../../../src/modules/Identity"
import { pipe } from "../../../src/utils/flow"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", async () => {
      const x = 1
      const fa: S.Sync<number> = jest.fn (S.of (x))

      const result = S.fromSync (S.map (fa, identity))
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
      const getFa = () => S.of (x)

      const fa1: S.Sync<number> = jest.fn (getFa ())
      const fa2: S.Sync<number> = jest.fn (getFa ())

      const result1 = pipe (
        S.map (fa1, a => bc (ab (a))),
        S.fromSync,
      )
      const result2 = pipe (S.map (S.map (fa2, ab), bc), S.fromSync)

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })
  })
})
