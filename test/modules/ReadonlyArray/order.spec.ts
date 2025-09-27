import { Number, pipe, Array } from '../../../src'

describe('getOrder', () => {
  const Order = Array.getOrder(Number.Order)

  it('should correctly compare two arrays', () => {
    pipe([], Order.compare([]), expect).toBe(0)
    pipe([1], Order.compare([]), expect).toBe(1)
    pipe([], Order.compare([1]), expect).toBe(-1)
    pipe([1], Order.compare([1]), expect).toBe(0)
    pipe([1], Order.compare([2]), expect).toBe(-1)
    pipe([2], Order.compare([1]), expect).toBe(1)
    pipe([1, 2], Order.compare([1]), expect).toBe(1)
    pipe([1], Order.compare([1, 2]), expect).toBe(-1)
  })
})
