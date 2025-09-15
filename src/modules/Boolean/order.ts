import * as order from "../../typeclasses/Order"

export const Order: order.Order<boolean> = {
  compare: y => x => y === x ? 0 : !x ? -1 : 1,
}
