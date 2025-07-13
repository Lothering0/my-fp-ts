import { curry, uncurry } from "../../src/utils/currying"

describe ("currying", () => {
  describe ("curry", () => {
    it ("should correctly curry a function", () => {
      const f = (a: string, b: string) => `${a}${b}`

      expect (curry (f) ("a") ("b")).toBe (f ("a", "b"))
    })
  })

  describe ("uncurry", () => {
    it ("should correctly uncurry a function", () => {
      const f = (a: string) => (b: string) => `${a}${b}`

      expect (uncurry (f) ("a", "b")).toBe (f ("a") ("b"))
    })
  })
})
