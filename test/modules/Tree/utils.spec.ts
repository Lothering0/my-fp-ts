import { pipe, Tree, String } from '../../../src'

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

describe('drawTree', () => {
  it('should return 2D string representation of a tree', () => {
    pipe(
      Tree.make('a', [
        Tree.make('b'),
        Tree.make('c', [
          Tree.make('e'),
          Tree.make('f'),
          Tree.make('g', [Tree.make('h')]),
        ]),
        Tree.make('d'),
      ]),
      Tree.drawTree(String.Show),
      expect,
    ).toBe(`"a"
├─ "b"
└─ "c"
   ├─ "e"
   ├─ "f"
   └─ "g"
      └─ "h"
└─ "d"`)
  })
})

describe('drawForest', () => {
  it('should return 2D string representation of a forest', () => {
    pipe([], Tree.drawForest(String.Show), expect).toBe('')
    pipe([Tree.make('a')], Tree.drawForest(String.Show), expect).toBe('"a"')
    pipe([Tree.make('a'), Tree.make('b')], Tree.drawForest(String.Show), expect)
      .toBe(`"a"
"b"`)
    pipe(
      [Tree.make('a'), Tree.make('b', [Tree.make('d')]), Tree.make('c')],
      Tree.drawForest(String.Show),
      expect,
    ).toBe(`"a"
"b"
└─ "d"
"c"`)
  })
})
