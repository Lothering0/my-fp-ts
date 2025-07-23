import * as RA from "../../../src/modules/ReadonlyArray"

describe ("extend", () => {
  it ("should correctly extend an array", () =>
    expect (RA.extend (["a", "b", "c"], RA.join (","))).toEqual ([
      "a,b,c",
      "b,c",
      "c",
    ]))
})
