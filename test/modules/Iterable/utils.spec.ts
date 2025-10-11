import { Iterable, Option, pipe } from '../../../src'

function* getIterable(length: number, f: jest.Mock) {
  let i = 0
  while (length--) {
    f()
    yield ++i
  }
}

describe('length', () => {
  it('should return length of an iterable', () => {
    const f = jest.fn()
    pipe(getIterable(0, f), Iterable.length, expect).toBe(0)
    pipe(getIterable(1, f), Iterable.length, expect).toBe(1)
    pipe(getIterable(3, f), Iterable.length, expect).toBe(3)
  })
})

describe('has', () => {
  it('should return whether iterable has an index or not', () => {
    const f = jest.fn()
    pipe(getIterable(3, f), Iterable.has(-1), expect).toBe(false)
    expect(f).toHaveBeenCalledTimes(0)
    f.mockReset()

    pipe(getIterable(0, f), Iterable.has(0), expect).toBe(false)
    expect(f).toHaveBeenCalledTimes(0)
    f.mockReset()

    pipe(getIterable(1, f), Iterable.has(0), expect).toBe(true)
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    pipe(getIterable(3, f), Iterable.has(0), expect).toBe(true)
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    pipe(getIterable(3, f), Iterable.has(2), expect).toBe(true)
    expect(f).toHaveBeenCalledTimes(3)
    f.mockReset()

    pipe(getIterable(3, f), Iterable.has(3), expect).toBe(false)
    expect(f).toHaveBeenCalledTimes(3)
    f.mockReset()
  })
})

describe('head', () => {
  it('should return an `Option` of the first element of iterable', () => {
    const f = jest.fn()
    pipe(getIterable(0, f), Iterable.head, expect).toEqual(Option.none())
    expect(f).toHaveBeenCalledTimes(0)
    f.mockReset()

    pipe(getIterable(1, f), Iterable.head, expect).toEqual(Option.some(1))
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    pipe(getIterable(3, f), Iterable.head, expect).toEqual(Option.some(1))
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()
  })
})

describe('init', () => {
  it('should return an `Option` of all elements of iterable except last', () => {
    const f = jest.fn()
    let init

    init = pipe(getIterable(0, f), Iterable.init)
    expect(f).toHaveBeenCalledTimes(0)
    pipe(init, expect).toEqual(Option.none())
    f.mockReset()

    init = pipe(getIterable(1, f), Iterable.init)
    pipe(init, Option.map(Iterable.toReadonlyArray), expect).toEqual(
      Option.some([]),
    )
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    init = pipe(getIterable(3, f), Iterable.init)
    pipe(init, Option.map(Iterable.toReadonlyArray), expect).toEqual(
      Option.some([1, 2]),
    )
    expect(f).toHaveBeenCalledTimes(3)
    f.mockReset()
  })
})

describe('last', () => {
  it('should return an `Option` of the last element of iterable', () => {
    const f = jest.fn()
    pipe(getIterable(0, f), Iterable.last, expect).toEqual(Option.none())
    expect(f).toHaveBeenCalledTimes(0)
    f.mockReset()

    pipe(getIterable(1, f), Iterable.last, expect).toEqual(Option.some(1))
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    pipe(getIterable(3, f), Iterable.last, expect).toEqual(Option.some(3))
    expect(f).toHaveBeenCalledTimes(3)
    f.mockReset()
  })
})

describe('tail', () => {
  it('should return an `Option` of all elements of iterable except first', () => {
    const f = jest.fn()
    let tail

    tail = pipe(getIterable(0, f), Iterable.tail)
    expect(f).toHaveBeenCalledTimes(0)
    pipe(tail, expect).toEqual(Option.none())
    f.mockReset()

    tail = pipe(getIterable(1, f), Iterable.tail)
    pipe(tail, Option.map(Iterable.toReadonlyArray), expect).toEqual(
      Option.some([]),
    )
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    tail = pipe(getIterable(3, f), Iterable.tail)
    pipe(tail, Option.map(Iterable.toReadonlyArray), expect).toEqual(
      Option.some([2, 3]),
    )
    expect(f).toHaveBeenCalledTimes(3)
    f.mockReset()
  })
})

describe('lookup', () => {
  it('should return an `Option` of the element on some index', () => {
    const f = jest.fn()
    pipe(getIterable(3, f), Iterable.lookup(-1), expect).toEqual(Option.none())
    expect(f).toHaveBeenCalledTimes(0)
    f.mockReset()

    pipe(getIterable(0, f), Iterable.lookup(0), expect).toEqual(Option.none())
    expect(f).toHaveBeenCalledTimes(0)
    f.mockReset()

    pipe(getIterable(1, f), Iterable.lookup(0), expect).toEqual(Option.some(1))
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    pipe(getIterable(3, f), Iterable.lookup(2), expect).toEqual(Option.some(3))
    expect(f).toHaveBeenCalledTimes(3)
    f.mockReset()

    pipe(getIterable(3, f), Iterable.lookup(3), expect).toEqual(Option.none())
    expect(f).toHaveBeenCalledTimes(3)
    f.mockReset()
  })
})

describe('findMap', () => {
  it('should return an `Option` of the mapped element', () => {
    const f = jest.fn()
    const p = (n: number) => (n === 2 ? Option.some(n + 10) : Option.none())
    pipe(getIterable(0, f), Iterable.findMap(p), expect).toEqual(Option.none())
    expect(f).toHaveBeenCalledTimes(0)
    f.mockReset()

    pipe(getIterable(1, f), Iterable.findMap(p), expect).toEqual(Option.none())
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    pipe(getIterable(3, f), Iterable.findMap(p), expect).toEqual(
      Option.some(12),
    )
    expect(f).toHaveBeenCalledTimes(2)
    f.mockReset()
  })
})

describe('takeWhile', () => {
  it('should take elements from iterable while predicate holds true', () => {
    const f = jest.fn()
    const p = (n: number) => n < 3
    let taken

    taken = pipe(getIterable(0, f), Iterable.takeWhile(p))
    expect(f).toHaveBeenCalledTimes(0)
    pipe(taken, Iterable.toReadonlyArray, expect).toEqual([])
    expect(f).toHaveBeenCalledTimes(0)
    f.mockReset()

    taken = pipe(getIterable(1, f), Iterable.takeWhile(p))
    expect(f).toHaveBeenCalledTimes(0)
    pipe(taken, Iterable.toReadonlyArray, expect).toEqual([1])
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    taken = pipe(getIterable(4, f), Iterable.takeWhile(p))
    expect(f).toHaveBeenCalledTimes(0)
    pipe(taken, Iterable.toReadonlyArray, expect).toEqual([1, 2])
    expect(f).toHaveBeenCalledTimes(3)
    f.mockReset()
  })
})

describe('take', () => {
  it('should take n elements from iterable', () => {
    const f = jest.fn()
    let taken

    taken = pipe(getIterable(4, f), Iterable.take(0))
    expect(f).toHaveBeenCalledTimes(0)
    pipe(taken, Iterable.toReadonlyArray, expect).toEqual([])
    expect(f).toHaveBeenCalledTimes(0)
    f.mockReset()

    taken = pipe(getIterable(4, f), Iterable.take(2))
    expect(f).toHaveBeenCalledTimes(0)
    pipe(taken, Iterable.toReadonlyArray, expect).toEqual([1, 2])
    expect(f).toHaveBeenCalledTimes(2)
    f.mockReset()
  })
})

describe('dropWhile', () => {
  it('should drop elements from iterable while predicate holds true', () => {
    const f = jest.fn()
    const p = (n: number) => n < 3
    let dropped

    dropped = pipe(getIterable(0, f), Iterable.dropWhile(p))
    expect(f).toHaveBeenCalledTimes(0)
    pipe(dropped, Iterable.toReadonlyArray, expect).toEqual([])
    expect(f).toHaveBeenCalledTimes(0)
    f.mockReset()

    dropped = pipe(getIterable(1, f), Iterable.dropWhile(p))
    expect(f).toHaveBeenCalledTimes(0)
    pipe(dropped, Iterable.toReadonlyArray, expect).toEqual([])
    expect(f).toHaveBeenCalledTimes(1)
    f.mockReset()

    dropped = pipe(getIterable(4, f), Iterable.dropWhile(p))
    expect(f).toHaveBeenCalledTimes(0)
    pipe(dropped, Iterable.toReadonlyArray, expect).toEqual([3, 4])
    expect(f).toHaveBeenCalledTimes(4)
    f.mockReset()
  })
})

describe('drop', () => {
  it('should drop n elements from iterable', () => {
    const f = jest.fn()
    let dropped

    dropped = pipe(getIterable(4, f), Iterable.drop(0))
    expect(f).toHaveBeenCalledTimes(0)
    pipe(dropped, Iterable.toReadonlyArray, expect).toEqual([1, 2, 3, 4])
    expect(f).toHaveBeenCalledTimes(4)
    f.mockReset()

    dropped = pipe(getIterable(4, f), Iterable.drop(2))
    expect(f).toHaveBeenCalledTimes(0)
    pipe(dropped, Iterable.toReadonlyArray, expect).toEqual([3, 4])
    expect(f).toHaveBeenCalledTimes(4)
    f.mockReset()
  })
})

describe('chunksOf', () => {
  it('should return chunked iterable', () => {
    const f = jest.fn()
    pipe(
      getIterable(0, f),
      Iterable.chunksOf(-1),
      Iterable.map(Iterable.toReadonlyArray),
      Iterable.toReadonlyArray,
      expect,
    ).toEqual([])
    pipe(
      getIterable(0, f),
      Iterable.chunksOf(0),
      Iterable.map(Iterable.toReadonlyArray),
      Iterable.toReadonlyArray,
      expect,
    ).toEqual([])
    pipe(
      getIterable(5, f),
      Iterable.chunksOf(0),
      Iterable.map(Iterable.toReadonlyArray),
      Iterable.toReadonlyArray,
      expect,
    ).toEqual([])
    pipe(
      getIterable(5, f),
      Iterable.chunksOf(2),
      Iterable.map(Iterable.toReadonlyArray),
      Iterable.toReadonlyArray,
      expect,
    ).toEqual([[1, 2], [3, 4], [5]])
  })
})
