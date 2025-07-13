import * as A from "../../../src/modules/Array"

describe ("extend", () => {
  it ("should correctly extend an array", () =>
    expect (A.extend (["a", "b", "c"], A.join (","))).toEqual ([
      "a,b,c",
      "b,c",
      "c",
    ]))
})
