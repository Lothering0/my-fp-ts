import { pipe, string } from "../../../src"

describe ("Order", () => {
  it ("should correctly compare two strings", () => {
    pipe ("", string.compare (""), expect).toBe (0)
    pipe ("a", string.compare (""), expect).toBe (1)
    pipe ("", string.compare ("a"), expect).toBe (-1)
    pipe ("a", string.compare ("a"), expect).toBe (0)
    pipe ("a", string.compare ("b"), expect).toBe (-1)
    pipe ("b", string.compare ("a"), expect).toBe (1)
    pipe ("ab", string.compare ("a"), expect).toBe (1)
    pipe ("a", string.compare ("ab"), expect).toBe (-1)
  })
})
