import * as order from '../../typeclasses/Order'

export const Order: order.Order<number> = {
  compare: y => x => (x === y ? 0 : x > y ? 1 : -1),
}

export const { compare } = Order
