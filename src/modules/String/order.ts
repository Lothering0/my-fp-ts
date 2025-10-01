import * as Order_ from '../../typeclasses/Order'

export const Order: Order_.Order<string> = {
  compare: y => x => (x === y ? 0 : x > y ? 1 : -1),
}

export const { compare } = Order
