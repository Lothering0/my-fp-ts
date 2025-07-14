import { flip } from "../../src/utils/flip"

describe ("flip", () => {
  it ("should correctly flip parameters of a function", () => {
    const f = (a: string) => (b: string) => `${a}${b}`
    const x = "a"
    const y = "b"

    expect (flip (f) (y) (x)).toBe (f (x) (y))
  })
})
