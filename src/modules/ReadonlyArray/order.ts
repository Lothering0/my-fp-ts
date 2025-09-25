import * as order from "../../typeclasses/Order"
import * as number from "../Number"
import { pipe } from "../../utils/flow"

export const getOrder: {
  <A>(Order: order.Order<A>): order.Order<ReadonlyArray<A>>
} = Order => ({
  compare: ys => xs => {
    const minLength = Math.min (xs.length, ys.length)

    for (let i = 0; i < minLength; i++) {
      const x = xs[i]!
      const y = ys[i]!
      const ordering = Order.compare (y) (x)

      if (ordering === 0) {
        continue
      }

      return ordering
    }

    return pipe (xs.length, number.compare (ys.length))
  },
})
