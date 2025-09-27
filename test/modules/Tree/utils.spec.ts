import { Tree } from '../../../src'

describe('make', () => {
  it('should create correct iterable tree', () => {
    expect([
      ...Tree.make(1, [
        Tree.make(2, [Tree.make(3), Tree.make(4)]),
        Tree.make(5),
      ]),
    ]).toEqual([1, 2, 3, 4, 5])
  })
})
