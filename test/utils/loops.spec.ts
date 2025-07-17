import * as A from "../../src/modules/Array"
import { Sync } from "../../src/modules/Sync"
import { getDoWhile } from "../../src/utils/loops"

describe ("getDoWhile", () => {
  it ("should correctly run", () => {
    const iterationsCount = 5
    const doWhile = getDoWhile (A)
    const xs: number[] = []

    const unsafeInsert: {
      <A>(xs: A[], x: A): Sync<void>
    } = (xs, x) => jest.fn (() => xs.push (x))
    const p = jest.fn (() => A.length (xs) < iterationsCount)
    const f: Sync<void> = unsafeInsert (xs, 0)

    const result = doWhile (p) (f)

    expect (p).toHaveBeenCalledTimes (iterationsCount + 1)
    expect (f).toHaveBeenCalledTimes (iterationsCount)

    expect (xs).toEqual ([0, 0, 0, 0, 0])
    expect (result).toEqual (A.of (undefined))
  })
})
