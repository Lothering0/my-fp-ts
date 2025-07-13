import * as A from "../../../src/modules/Array"
import { overloadLast } from "../../../src/utils/overloads"

describe ("overloadLast", () => {
  it ("should correctly overload function without parameters", () => {
    const f = (point: string) => point

    expect (overloadLast (0, f) () ("a")).toBe ("a")
    expect (overloadLast (0) (f) () ("a")).toBe ("a")
  })

  it ("should correctly overload function with 1 parameter", () => {
    const f = (point: string, a: string) => A.join ([point, a], "")

    expect (overloadLast (1, f) ("a") ("b")).toBe ("ab")
    expect (overloadLast (1) (f) ("a") ("b")).toBe ("ab")
  })

  it ("should correctly overload function with 2 parameters", () => {
    const f = (point: string, a: string, b: string) => A.join ([point, a, b], "")

    expect (overloadLast (2, f) ("a", "b") ("c")).toBe ("abc")
    expect (overloadLast (2) (f) ("a", "b") ("c")).toBe ("abc")
  })

  it ("should correctly overload function with any count of parameters", () => {
    const f = (...args: string[]) => A.join (args, "")

    expect (
      overloadLast (10, f) ("a", "b", "c", "d", "e", "f", "g", "h", "i") ("j"),
    ).toBe ("abcdefghij")
    expect (
      overloadLast (10) (f) ("a", "b", "c", "d", "e", "f", "g", "h", "i") ("j"),
    ).toBe ("abcdefghij")
  })
})
