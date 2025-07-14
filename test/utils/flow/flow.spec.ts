import { concat } from "../../../src/modules/String"
import { flow } from "../../../src/utils/flow"

describe ("flow", () => {
  it ("should be equal to its only function", () => {
    const f = concat ("a")
    expect (flow (f) ("b")).toBe (f ("b"))
  })

  it ("should return function that passes result of the previous function execution to the next function", () => {
    const f = concat ("b")
    const g = concat ("c")
    expect (flow (f, g) ("a")).toBe (g (f ("a")))
  })

  it ("should apply all passed arguments to the first function", () => {
    const f = concat
    const g = concat ("c")
    expect (flow (f, g) ("a", "b")).toBe (g (f ("a", "b")))
  })
})
