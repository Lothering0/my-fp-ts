import * as readonlyArray from "../../src/modules/ReadonlyArray"
import * as option from "../../src/modules/Option"
import { Sync } from "../../src/modules/Sync"
import { doWhile } from "../../src/utils/loops"

describe ("getDoWhile", () => {
  it ("should correctly run", () => {
    const iterationsCount = 5
    const xs: number[] = []

    const unsafeInsert: {
      <A>(xs: A[], x: A): Sync<void>
    } = (xs, x) => jest.fn (() => xs.push (x))
    const p = jest.fn (() => readonlyArray.length (xs) < iterationsCount)
    const f: Sync<void> = unsafeInsert (xs, 0)

    const result = doWhile (f) (p)

    expect (p).toHaveBeenCalledTimes (iterationsCount)
    expect (f).toHaveBeenCalledTimes (iterationsCount)

    expect (xs).toEqual ([0, 0, 0, 0, 0])
    expect (result).toEqual (option.some (iterationsCount))
  })
})
