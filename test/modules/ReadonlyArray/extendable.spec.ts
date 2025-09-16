import { readonlyArray } from "../../../src"

describe ("extend", () => {
  it ("should correctly extend an array", () =>
    expect (
      readonlyArray.extend (readonlyArray.join (",")) (["a", "b", "c"]),
    ).toEqual (["a,b,c", "b,c", "c"]))
})
