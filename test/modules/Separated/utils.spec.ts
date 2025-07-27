import * as separated from "../../../src/modules/Separated"

describe ("make", () => {
  it ("should create correct instance of `Separated`", () =>
    expect (separated.make ("a", 1)).toEqual<separated.Separated<string, number>> (
      {
        left: "a",
        right: 1,
      },
    ))
})
