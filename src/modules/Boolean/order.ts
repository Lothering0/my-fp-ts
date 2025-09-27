import * as Order_ from '../../typeclasses/Order'

export const Order: Order_.Order<boolean> = {
  compare: y => x => (y === x ? 0 : !x ? -1 : 1),
}
