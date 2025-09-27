import { doWhile, Option, Array, Sync } from '../../src'

describe('getDoWhile', () => {
  it('should correctly run', () => {
    const iterationsCount = 5
    const xs: number[] = []

    const unsafeInsert: {
      <A>(xs: A[], x: A): Sync.Sync<void>
    } = (xs, x) => jest.fn(() => xs.push(x))
    const p = jest.fn(() => Array.length(xs) < iterationsCount)
    const f: Sync.Sync<void> = unsafeInsert(xs, 0)

    const result = doWhile(f)(p)

    expect(p).toHaveBeenCalledTimes(iterationsCount)
    expect(f).toHaveBeenCalledTimes(iterationsCount)

    expect(xs).toEqual([0, 0, 0, 0, 0])
    expect(result).toEqual(Option.some(iterationsCount))
  })
})
