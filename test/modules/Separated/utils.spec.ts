import * as S from "../../../src/modules/Separated"

describe ("make", () => {
  it ("should create correct instance of `Separated`", () =>
    expect (S.make ("a", 1)).toEqual<S.Separated<string, number>> ({
      left: "a",
      right: 1,
    }))
})
