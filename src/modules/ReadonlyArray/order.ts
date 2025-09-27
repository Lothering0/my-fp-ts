import * as Order from '../../typeclasses/Order'
import * as Number from '../Number'
import { pipe } from '../../utils/flow'

export const getOrder: {
  <A>(Order: Order.Order<A>): Order.Order<ReadonlyArray<A>>
} = Order => ({
  compare: ys => xs => {
    const minLength = Math.min(xs.length, ys.length)

    for (let i = 0; i < minLength; i++) {
      const x = xs[i]!
      const y = ys[i]!
      const ordering = Order.compare(y)(x)

      if (ordering === 0) {
        continue
      }

      return ordering
    }

    return pipe(xs.length, Number.compare(ys.length))
  },
})
