import { concat } from "../../../src/modules/String"
import { flow } from "../../../src/utils/flow"

describe ("flow", () => {
  it ("should be equal to its only function", () => {
    const f = jest.fn (concat ("a"))
    expect (flow (f) ("b")).toBe (f ("b"))
    expect (f).toHaveBeenCalledTimes (2)
  })

  it ("should return function that passes result of the previous function execution to the next function", () => {
    const f = jest.fn (concat ("b"))
    const g = jest.fn (concat ("c"))
    expect (flow (f, g) ("a")).toBe (g (f ("a")))
    expect (f).toHaveBeenCalledTimes (2)
    expect (g).toHaveBeenCalledTimes (2)
  })

  it ("should apply all passed arguments to the first function", () => {
    const f = jest.fn (concat)
    const g = jest.fn (concat ("c"))
    expect (flow (f, g) ("a", "b")).toBe (g (f ("a", "b")))
    expect (f).toHaveBeenCalledTimes (2)
    expect (g).toHaveBeenCalledTimes (2)
  })
})
