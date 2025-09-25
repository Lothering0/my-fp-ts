import * as order from "../../typeclasses/Order"
import * as number from "../Number"
import { pipe } from "../../utils/flow"

export const Order: order.Order<string> = {
  compare: ys => xs => {
    const minLength = Math.min (xs.length, ys.length)

    for (let i = 0; i < minLength; i++) {
      const x = xs[i]!.charCodeAt (0)
      const y = ys[i]!.charCodeAt (0)
      const ordering = number.compare (y) (x)

      if (ordering === 0) {
        continue
      }

      return ordering
    }

    return pipe (xs.length, number.compare (ys.length))
  },
}

export const { compare } = Order
