import * as tree from "../../../src/modules/Tree"

describe ("make", () => {
  it ("should create correct iterable tree", () => {
    expect ([
      ...tree.make (1, [
        tree.make (2, [tree.make (3), tree.make (4)]),
        tree.make (5),
      ]),
    ]).toEqual ([1, 2, 3, 4, 5])
  })
})
