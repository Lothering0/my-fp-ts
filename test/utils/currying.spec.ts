import { curry, uncurry } from "../../src/utils/currying"

describe ("currying", () => {
  describe ("curry", () => {
    it ("should correctly curry a function", () => {
      const f = (a: string, b: string) => `${a}${b}`
      const x = "a"
      const y = "b"

      expect (curry (f) (x) (y)).toBe (f (x, y))
    })
  })

  describe ("uncurry", () => {
    it ("should correctly uncurry a function", () => {
      const f = (a: string) => (b: string) => `${a}${b}`
      const x = "a"
      const y = "b"

      expect (uncurry (f) (x, y)).toBe (f (x) (y))
    })
  })
})
