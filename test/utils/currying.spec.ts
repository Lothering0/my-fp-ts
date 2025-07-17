import { curry, uncurry } from "../../src/utils/currying"

describe ("currying", () => {
  describe ("curry", () => {
    it ("should correctly curry a function", () => {
      const f = jest.fn ((a: string, b: string) => `${a}${b}`)
      const x = "a"
      const y = "b"

      expect (curry (f) (x) (y)).toBe (f (x, y))
      expect (f).toHaveBeenCalledTimes (2)
    })
  })

  describe ("uncurry", () => {
    it ("should correctly uncurry a function", () => {
      const f = jest.fn ((a: string) => (b: string) => `${a}${b}`)
      const x = "a"
      const y = "b"

      expect (uncurry (f) (x, y)).toBe (f (x) (y))
      expect (f).toHaveBeenCalledTimes (2)
    })
  })
})
