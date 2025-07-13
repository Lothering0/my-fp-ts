import * as T from "../../../src/modules/Tree"

describe ("make", () => {
  it ("should create correct instance of `Tree` if `forest` argument is not provided", () =>
    expect (T.make (1)).toEqual<T.Tree<number>> ({
      value: 1,
      forest: [],
    }))

  it ("should create correct instance of `Tree` if provided empty `forest`", () =>
    expect (T.make (1, [])).toEqual<T.Tree<number>> ({
      value: 1,
      forest: [],
    }))

  it ("should create correct instance of `Tree` if `forest` argument is provided", () =>
    expect (T.make (1, [T.make (2, [T.make (4)]), T.make (3)])).toEqual<
      T.Tree<number>
    > ({
      value: 1,
      forest: [
        {
          value: 2,
          forest: [
            {
              value: 4,
              forest: [],
            },
          ],
        },
        {
          value: 3,
          forest: [],
        },
      ],
    }))
})
