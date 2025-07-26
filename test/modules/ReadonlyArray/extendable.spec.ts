import * as RA from "../../../src/modules/ReadonlyArray"

describe ("extend", () => {
  it ("should correctly extend an array", () =>
    expect (RA.extend (RA.join (",")) (["a", "b", "c"])).toEqual ([
      "a,b,c",
      "b,c",
      "c",
    ]))
})
