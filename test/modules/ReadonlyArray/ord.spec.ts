import * as readonlyArray from "../../../src/modules/ReadonlyArray"
import * as number from "../../../src/modules/Number"
import { pipe } from "../../../src/utils/flow"

describe ("Ord", () => {
  const Ord = readonlyArray.getOrd (number.Ord)

  it ("should correctly compare two arrays", () => {
    pipe ([], Ord.compare ([]), expect).toBe (0)
    pipe ([1], Ord.compare ([]), expect).toBe (1)
    pipe ([], Ord.compare ([1]), expect).toBe (-1)
    pipe ([1], Ord.compare ([1]), expect).toBe (0)
    pipe ([1], Ord.compare ([2]), expect).toBe (-1)
    pipe ([2], Ord.compare ([1]), expect).toBe (1)
    pipe ([1, 2], Ord.compare ([1]), expect).toBe (1)
    pipe ([1], Ord.compare ([1, 2]), expect).toBe (-1)
  })
})
