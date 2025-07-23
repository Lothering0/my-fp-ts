import * as RA from "../../../src/modules/ReadonlyArray"
import { overload } from "../../../src/utils/overloads"

describe ("overload", () => {
  it ("should correctly overload function without parameters", () => {
    const f = jest.fn ((point: string) => point)

    expect (overload (0, f) () ("a")).toBe ("a")
    expect (overload (0) (f) () ("a")).toBe ("a")
    expect (f).toHaveBeenCalledTimes (2)
  })

  it ("should correctly overload function with 1 parameter", () => {
    const f = jest.fn ((point: string, a: string) => RA.join ([point, a], ""))

    expect (overload (1, f) ("b") ("a")).toBe ("ab")
    expect (overload (1) (f) ("b") ("a")).toBe ("ab")
    expect (f).toHaveBeenCalledTimes (2)
  })

  it ("should correctly overload function with 2 parameters", () => {
    const f = jest.fn ((point: string, a: string, b: string) =>
      RA.join ([point, a, b], ""),
    )

    expect (overload (2, f) ("b", "c") ("a")).toBe ("abc")
    expect (overload (2) (f) ("b", "c") ("a")).toBe ("abc")
    expect (f).toHaveBeenCalledTimes (2)
  })

  it ("should correctly overload function with any count of parameters", () => {
    const f = jest.fn ((...args: ReadonlyArray<string>) => RA.join (args, ""))

    expect (
      overload (10, f) ("b", "c", "d", "e", "f", "g", "h", "i", "j") ("a"),
    ).toBe ("abcdefghij")
    expect (
      overload (10) (f) ("b", "c", "d", "e", "f", "g", "h", "i", "j") ("a"),
    ).toBe ("abcdefghij")
    expect (f).toHaveBeenCalledTimes (2)
  })
})
