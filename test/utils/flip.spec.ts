import { flip } from "../../src/utils/flip"

describe ("flip", () => {
  it ("should correctly flip parameters of a function", () => {
    const f = (a: string) => (b: string) => `${a}${b}`

    expect (flip (f) ("a") ("b")).toBe (f ("b") ("a"))
  })
})
