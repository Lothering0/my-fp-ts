import * as RA from "../../../src/modules/ReadonlyArray"
import { overloadLast } from "../../../src/utils/overloads"

describe ("overloadLast", () => {
  it ("should correctly overload function without parameters", () => {
    const f = jest.fn ((point: string) => point)

    expect (overloadLast (0, f) () ("a")).toBe ("a")
    expect (overloadLast (0) (f) () ("a")).toBe ("a")
    expect (f).toHaveBeenCalledTimes (2)
  })

  it ("should correctly overload function with 1 parameter", () => {
    const f = jest.fn ((point: string, a: string) => RA.join ([point, a], ""))

    expect (overloadLast (1, f) ("a") ("b")).toBe ("ab")
    expect (overloadLast (1) (f) ("a") ("b")).toBe ("ab")
    expect (f).toHaveBeenCalledTimes (2)
  })

  it ("should correctly overload function with 2 parameters", () => {
    const f = jest.fn ((point: string, a: string, b: string) =>
      RA.join ([point, a, b], ""),
    )

    expect (overloadLast (2, f) ("a", "b") ("c")).toBe ("abc")
    expect (overloadLast (2) (f) ("a", "b") ("c")).toBe ("abc")
    expect (f).toHaveBeenCalledTimes (2)
  })

  it ("should correctly overload function with any count of parameters", () => {
    const f = jest.fn ((...args: ReadonlyArray<string>) => RA.join (args, ""))

    expect (
      overloadLast (10, f) ("a", "b", "c", "d", "e", "f", "g", "h", "i") ("j"),
    ).toBe ("abcdefghij")
    expect (
      overloadLast (10) (f) ("a", "b", "c", "d", "e", "f", "g", "h", "i") ("j"),
    ).toBe ("abcdefghij")
    expect (f).toHaveBeenCalledTimes (2)
  })
})
