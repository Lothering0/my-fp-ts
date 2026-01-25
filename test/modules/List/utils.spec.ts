import { List, pipe, Number, Option, Iterable, absurd } from '../../../src'

const ListEquivalence = List.getEquivalence(Number.Equivalence)

describe('fromIterable', () => {
  it('should generate a list from an `Iterable`', () => {
    pipe(
      [],
      List.fromIterable,
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
    pipe(
      [1, 2, 3],
      List.fromIterable,
      ListEquivalence.equals(List.cons(1, List.cons(2, List.cons(3)))),
      expect,
    ).toBe(true)
  })
})

describe('length', () => {
  it("should return a `List`'s length", () => {
    pipe([1, 2, 3], List.fromIterable, List.length, expect).toBe(3)
    pipe(
      [1, 2, 3],
      List.fromIterable,
      List.append(4),
      List.length,
      expect,
    ).toBe(4)
    pipe(
      [1, 2, 3],
      List.fromIterable,
      List.prepend(0),
      List.length,
      expect,
    ).toBe(4)
    pipe(
      [1, 2, 3],
      List.fromIterable,
      List.prepend(0),
      List.append(4),
      List.prepend(-1),
      List.append(5),
      List.length,
      expect,
    ).toBe(7)
  })
})

describe('prepend', () => {
  const initialList = List.cons(4)
  const list = pipe(
    initialList,
    List.prepend(3),
    List.prepend(2),
    List.prepend(1),
  )

  it('initial list should stay unchanged', () => {
    pipe(initialList, ListEquivalence.equals(List.cons(4)), expect).toBe(true)
    expect([...initialList]).toEqual([4])
  })

  it('should append elements to the list', () => {
    pipe(
      list,
      ListEquivalence.equals(
        List.cons(1, List.cons(2, List.cons(3, List.cons(4)))),
      ),
      expect,
    ).toBe(true)
    expect([...list]).toEqual([1, 2, 3, 4])
  })
})

describe('append', () => {
  const initialList = List.cons(1)
  const list = pipe(initialList, List.append(2), List.append(3), List.append(4))

  it('initial list should stay unchanged', () => {
    pipe(initialList, ListEquivalence.equals(List.cons(1)), expect).toBe(true)
    expect([...initialList]).toEqual([1])
  })

  it('should append elements to the list', () => {
    pipe(
      list,
      ListEquivalence.equals(
        List.cons(1, List.cons(2, List.cons(3, List.cons(4)))),
      ),
      expect,
    ).toBe(true)
    expect([...list]).toEqual([1, 2, 3, 4])
  })
})

describe('head', () => {
  it('should return first element of the list', () => {
    const list1 = List.nil()
    const list2 = pipe(list1, List.prepend(2))
    const list3 = pipe(list2, List.prepend(1))
    pipe(list1, List.head, Option.isNone, expect).toBe(true)
    pipe(list2, List.head, Option.getOrElse(absurd), expect).toBe(2)
    pipe(list3, List.head, Option.getOrElse(absurd), expect).toBe(1)
  })
})

describe('init', () => {
  it('should return all elements of the list but last', () => {
    pipe(List.nil(), List.init, Option.isNone, expect).toBe(true)
    pipe(
      1,
      List.cons,
      List.init,
      Option.getOrElse(absurd),
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
    pipe(
      1,
      List.cons,
      List.append(2),
      List.append(3),
      List.init,
      Option.getOrElse(absurd),
      ListEquivalence.equals(List.cons(1, List.cons(2))),
      expect,
    ).toBe(true)
  })
})

describe('last', () => {
  it('should return last element of the list', () => {
    const list1 = List.nil()
    const list2 = pipe(list1, List.append(1))
    const list3 = pipe(list2, List.append(2))
    pipe(list1, List.last, Option.isNone, expect).toBe(true)
    pipe(list2, List.last, Option.getOrElse(absurd), expect).toBe(1)
    pipe(list3, List.last, Option.getOrElse(absurd), expect).toBe(2)
  })
})

describe('tail', () => {
  it('should return all elements of the list but first', () => {
    pipe(List.nil(), List.tail, Option.isNone, expect).toBe(true)
    pipe(
      1,
      List.cons,
      List.append(2),
      List.append(3),
      List.tail,
      Option.getOrElse(List.nil),
      ListEquivalence.equals(List.cons(2, List.cons(3))),
      expect,
    ).toBe(true)
  })
})

describe('concat', () => {
  it('should concatenate two lists', () => {
    pipe(
      List.fromIterable([1, 2]),
      List.concat(List.fromIterable([3, 4])),
      ListEquivalence.equals(List.fromIterable([1, 2, 3, 4])),
      expect,
    ).toBe(true)
  })
})

describe('prependAllWith', () => {
  it('should place value before each element in the lists', () => {
    pipe(
      ['a', 'b', 'c'],
      List.fromIterable,
      List.prependAllWith((a, i) => `${a}-${i}`),
      Iterable.toReadonlyArray,
      expect,
    ).toEqual(['a-0', 'a', 'b-1', 'b', 'c-2', 'c'])
  })
})

describe('appendAllWith', () => {
  it('should place value after each element in the lists', () => {
    pipe(
      ['a', 'b', 'c'],
      List.fromIterable,
      List.appendAllWith((a, i) => `${a}-${i}`),
      Iterable.toReadonlyArray,
      expect,
    ).toEqual(['a', 'a-0', 'b', 'b-1', 'c', 'c-2'])
  })
})

describe('range', () => {
  it('should generate list with numbers in given range', () => {
    pipe(0, List.range(0), ListEquivalence.equals(List.cons(0)), expect).toBe(
      true,
    )
    pipe(
      0,
      List.range(2),
      ListEquivalence.equals(List.fromIterable([0, 1, 2])),
      expect,
    ).toBe(true)
    pipe(
      2,
      List.range(0),
      ListEquivalence.equals(List.fromIterable([2, 1, 0])),
      expect,
    ).toBe(true)
  })
})

describe('takeWhile', () => {
  it('should take elements from list until given predicate return `false`', () => {
    const f = jest.fn()
    pipe(
      List.nil(),
      List.takeWhile(() => {
        f()
        return true
      }),
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(0)
    f.mockReset()

    pipe(
      1,
      List.cons,
      List.takeWhile(() => {
        f()
        return true
      }),
      ListEquivalence.equals(List.cons(1)),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    pipe(
      1,
      List.cons,
      List.takeWhile(() => {
        f()
        return false
      }),
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    pipe(
      1,
      List.cons,
      List.append(2),
      List.takeWhile(() => {
        f()
        return false
      }),
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    pipe(
      1,
      List.cons,
      List.append(2),
      List.takeWhile(() => {
        f()
        return true
      }),
      ListEquivalence.equals(List.fromIterable([1, 2])),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(2)
    f.mockReset()

    pipe(
      1,
      List.cons,
      List.append(2),
      List.append(3),
      List.append(4),
      List.takeWhile((a, i) => {
        f()
        return `${a}-${i}` !== '3-2'
      }),
      ListEquivalence.equals(List.fromIterable([1, 2])),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(3)
    f.mockReset()
  })
})

describe('take', () => {
  it('should take exact amount of nodes from the list', () => {
    pipe(
      List.nil(),
      List.take(0),
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
    pipe(
      List.nil(),
      List.take(1),
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
    pipe(
      1,
      List.cons,
      List.take(0),
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
    pipe(
      1,
      List.cons,
      List.take(2),
      ListEquivalence.equals(List.cons(1)),
      expect,
    ).toBe(true)
    pipe(
      1,
      List.cons,
      List.append(2),
      List.append(3),
      List.append(4),
      List.take(2),
      ListEquivalence.equals(List.fromIterable([1, 2])),
      expect,
    ).toBe(true)
    pipe(
      1,
      List.cons,
      List.append(2),
      List.append(3),
      List.append(4),
      List.take(-1),
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
  })
})

describe('dropWhile', () => {
  it('should drop elements from list until given predicate return `false`', () => {
    const f = jest.fn()
    pipe(
      List.nil(),
      List.dropWhile(() => {
        f()
        return true
      }),
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(0)
    f.mockReset()

    pipe(
      1,
      List.cons,
      List.dropWhile(() => {
        f()
        return false
      }),
      ListEquivalence.equals(List.cons(1)),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    pipe(
      1,
      List.cons,
      List.dropWhile(() => {
        f()
        return true
      }),
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    pipe(
      1,
      List.cons,
      List.append(2),
      List.dropWhile(() => {
        f()
        return true
      }),
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(2)
    f.mockReset()

    pipe(
      1,
      List.cons,
      List.append(2),
      List.dropWhile(() => {
        f()
        return false
      }),
      ListEquivalence.equals(List.fromIterable([1, 2])),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    pipe(
      1,
      List.cons,
      List.append(2),
      List.append(3),
      List.append(4),
      List.dropWhile((a, i) => {
        f()
        return `${a}-${i}` !== '3-2'
      }),
      ListEquivalence.equals(List.fromIterable([3, 4])),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(3)
    f.mockReset()
  })
})

describe('drop', () => {
  it('should drop exact amount of nodes from the list', () => {
    pipe(
      List.nil(),
      List.drop(0),
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
    pipe(
      List.nil(),
      List.drop(1),
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
    pipe(
      1,
      List.cons,
      List.drop(0),
      ListEquivalence.equals(List.cons(1)),
      expect,
    ).toBe(true)
    pipe(
      1,
      List.cons,
      List.drop(2),
      ListEquivalence.equals(List.nil()),
      expect,
    ).toBe(true)
    pipe(
      1,
      List.cons,
      List.append(2),
      List.append(3),
      List.append(4),
      List.drop(2),
      ListEquivalence.equals(List.fromIterable([3, 4])),
      expect,
    ).toBe(true)
    pipe(
      1,
      List.cons,
      List.append(2),
      List.append(3),
      List.append(4),
      List.drop(-1),
      ListEquivalence.equals(List.fromIterable([1, 2, 3, 4])),
      expect,
    ).toBe(true)
  })
})
