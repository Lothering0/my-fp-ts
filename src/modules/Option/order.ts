import { Order } from '../../typeclasses/Order'
import { constant } from '../../utils/constant'
import { pipe } from '../../utils/flow'
import { match } from './matchers'
import { Option } from './option'

export const getOrder: {
  <A>(Order: Order<A>): Order<Option<A>>
} = Order => ({
  compare: my =>
    match({
      onSome: x =>
        pipe(
          my,
          match({
            onSome: y => pipe(x, Order.compare(y)),
            onNone: constant(1),
          }),
        ),
      onNone: () =>
        pipe(
          my,
          match({
            onSome: constant(-1),
            onNone: constant(0),
          }),
        ),
    }),
})
