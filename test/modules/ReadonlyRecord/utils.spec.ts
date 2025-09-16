import { number, pipe, readonlyRecord, string } from "../../../src"

describe ("getUnion", () => {
  const union = readonlyRecord.getUnion (number.GroupSum)

  it ("should return union of first and second record combined by provided magma", () => {
    pipe ({ a: 1, b: 2, c: 3 }, union ({ b: 1, c: 2, d: 3 }), expect).toEqual ({
      a: 1,
      b: 3,
      c: 5,
      d: 3,
    })
  })
})

describe ("sortValues", () => {
  it ("should sort record by values with provided `Order` instance", () => {
    pipe (
      { b: "c", a: "b", c: "a" },
      readonlyRecord.sortValues (string.Order),
      readonlyRecord.toEntries,
      expect,
    ).toEqual ([
      ["c", "a"],
      ["a", "b"],
      ["b", "c"],
    ])
  })
})

describe ("sortKeys", () => {
  it ("should sort record by keys with provided `Order` instance", () => {
    pipe (
      { b: "c", a: "b", c: "a" },
      readonlyRecord.sortKeys (string.Order),
      readonlyRecord.toEntries,
      expect,
    ).toEqual ([
      ["a", "b"],
      ["b", "c"],
      ["c", "a"],
    ])
  })
})
