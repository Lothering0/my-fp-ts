import { Number, pipe, Array } from '../../../src'

describe('getDifferenceMagma', () => {
  const DifferenceMagma = Array.getDifferenceMagma(Number.Equivalence)

  it('should return all elements of the first array which is not contained by the second', () => {
    pipe([1, 2, 3], DifferenceMagma.combine([2, 3]), expect).toEqual([1])
    pipe([1, 2, 3], DifferenceMagma.combine([2, 3, 4]), expect).toEqual([1])
    pipe([1, 2, 3], DifferenceMagma.combine([4, 5, 6]), expect).toEqual([
      1, 2, 3,
    ])
    pipe([1, 2, 3], DifferenceMagma.combine([1, 2, 3]), expect).toEqual([])
    pipe([], DifferenceMagma.combine([1, 2, 3]), expect).toEqual([])
  })
})
