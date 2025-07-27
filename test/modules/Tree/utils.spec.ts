import * as tree from "../../../src/modules/Tree"

describe ("make", () => {
  it ("should create correct instance of `Tree` if `forest` argument is not provided", () =>
    expect (tree.make (1)).toEqual<tree.Tree<number>> ({
      value: 1,
      forest: [],
    }))

  it ("should create correct instance of `Tree` if provided empty `forest`", () =>
    expect (tree.make (1, [])).toEqual<tree.Tree<number>> ({
      value: 1,
      forest: [],
    }))

  it ("should create correct instance of `Tree` if `forest` argument is provided", () =>
    expect (tree.make (1, [tree.make (2, [tree.make (4)]), tree.make (3)])).toEqual<
      tree.Tree<number>
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
