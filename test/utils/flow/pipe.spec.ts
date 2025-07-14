import { concat } from "../../../src/modules/String"
import { pipe } from "../../../src/utils/flow"

describe ("pipe", () => {
  it ("should return its own argument", () => {
    const x = "a"
    expect (pipe (x)).toBe (x)
  })

  it ("should correctly apply first argument to the function of second", () => {
    const f = concat ("b")
    expect (pipe ("a", f)).toBe (f ("a"))
  })

  it ("should correctly apply result of the previous function execution to the next function", () => {
    const f = concat ("b")
    const g = concat ("c")
    expect (pipe ("a", f, g)).toBe (g (f ("a")))
  })
})
