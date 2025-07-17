import { failure, success } from "../../src/modules/Result"
import { raise, tryDo } from "../../src/utils/exceptions"

describe ("exceptions", () => {
  describe ("raise", () => {
    it ("should throw passed argument", () => {
      const x = "a"
      const f = jest.fn (raise)
      expect (() => f (x)).toThrow (x)
    })
  })

  describe ("tryDo", () => {
    it ("should return correct `Result` instance", () => {
      const x = "a"
      const fail = jest.fn (() => raise (x))
      const pass = jest.fn (() => x)

      expect (tryDo (fail)).toEqual (failure (x))
      expect (tryDo (pass)).toEqual (success (x))

      expect (fail).toHaveBeenCalledTimes (1)
      expect (pass).toHaveBeenCalledTimes (1)
    })
  })
})
