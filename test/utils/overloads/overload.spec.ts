import * as A from "../../../src/modules/Array"
import { overload } from "../../../src/utils/overloads"

describe ("overload", () => {
  it ("should correctly overload function without parameters", () => {
    const f = (point: string) => point

    expect (overload (0, f) () ("a")).toBe ("a")
    expect (overload (0) (f) () ("a")).toBe ("a")
  })

  it ("should correctly overload function with 1 parameter", () => {
    const f = (point: string, a: string) => A.join ([point, a], "")

    expect (overload (1, f) ("b") ("a")).toBe ("ab")
    expect (overload (1) (f) ("b") ("a")).toBe ("ab")
  })

  it ("should correctly overload function with 2 parameters", () => {
    const f = (point: string, a: string, b: string) => A.join ([point, a, b], "")

    expect (overload (2, f) ("b", "c") ("a")).toBe ("abc")
    expect (overload (2) (f) ("b", "c") ("a")).toBe ("abc")
  })

  it ("should correctly overload function with any count of parameters", () => {
    const f = (...args: string[]) => A.join (args, "")

    expect (
      overload (10, f) ("b", "c", "d", "e", "f", "g", "h", "i", "j") ("a"),
    ).toBe ("abcdefghij")
    expect (
      overload (10) (f) ("b", "c", "d", "e", "f", "g", "h", "i", "j") ("a"),
    ).toBe ("abcdefghij")
  })
})
