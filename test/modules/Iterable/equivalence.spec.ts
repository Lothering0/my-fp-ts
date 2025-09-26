import { iterable, number, pipe } from '../../../src'

describe('getEquivalence', () => {
  const Equivalence = iterable.getEquivalence(number.Equivalence)

  it('should return `true` for empty iterables', () => {
    pipe([], Equivalence.equals([]), expect).toBe(true)
  })

  it('should return `true` for the same iterables', () => {
    pipe([1, 2, 3], Equivalence.equals([1, 2, 3]), expect).toBe(true)
  })

  it('should return `false` if elements are differs', () => {
    pipe([1, 2, 3], Equivalence.equals([1, 4, 3]), expect).toBe(false)
  })

  it('should return `false` if iterable length is differs', () => {
    pipe([1, 2, 3], Equivalence.equals([1, 2]), expect).toBe(false)
    pipe([1, 2], Equivalence.equals([1, 2, 3]), expect).toBe(false)
  })

  it('should not do excessive iterations', () => {
    const f = jest.fn()
    const firstIterable = function* () {
      f()
      yield 1
      f()
      yield 2
      f()
      yield 3
      f()
      yield 4
    }
    const secondIterable = function* () {
      f()
      yield 1
      f()
      yield 4 // Different element
      f()
      yield 3
      f()
      yield 4
    }

    pipe(firstIterable(), Equivalence.equals(secondIterable()))
    expect(f).toHaveBeenCalledTimes(4)
  })
})
