import * as iterable from "../../../src/modules/Iterable"
import * as number from "../../../src/modules/Number"
import { pipe } from "../../../src/utils/flow"

describe ("getEq", () => {
  const Eq = iterable.getEq (number.Eq)

  it ("should return `true` for empty iterables", () => {
    pipe ([], Eq.equals ([]), expect).toBe (true)
  })

  it ("should return `true` for the same iterables", () => {
    pipe ([1, 2, 3], Eq.equals ([1, 2, 3]), expect).toBe (true)
  })

  it ("should return `false` if elements are differs", () => {
    pipe ([1, 2, 3], Eq.equals ([1, 4, 3]), expect).toBe (false)
  })

  it ("should return `false` if iterable length is differs", () => {
    pipe ([1, 2, 3], Eq.equals ([1, 2]), expect).toBe (false)
    pipe ([1, 2], Eq.equals ([1, 2, 3]), expect).toBe (false)
  })

  it ("should not do excessive iterations", () => {
    const f = jest.fn ()
    const firstIterable = function* () {
      f ()
      yield 1
      f ()
      yield 2
      f ()
      yield 3
      f ()
      yield 4
    }
    const secondIterable = function* () {
      f ()
      yield 1
      f ()
      yield 4 // Different element
      f ()
      yield 3
      f ()
      yield 4
    }

    pipe (firstIterable (), Eq.equals (secondIterable ()))
    expect (f).toHaveBeenCalledTimes (4)
  })
})
