import * as order from "../../typeclasses/Order"
import * as ordering from "../Ordering"
import * as option from "../Option"
import * as number from "../Number"
import * as boolean from "../Boolean"
import { pipe } from "../../utils/flow"
import { findMap, length, lookup } from "./utils"
import { constant } from "../../utils/constant"

export const getOrder: {
  <A>(Order: order.Order<A>): order.Order<ReadonlyArray<A>>
} = Order => ({
  compare: ys => xs =>
    pipe (
      xs,
      // Trying to find first index of both arrays where elements are unequal
      findMap ((x, i) =>
        pipe (
          ys,
          lookup (i),
          option.match ({
            onSome: y =>
              pipe (
                x,
                Order.compare (y),
                number.matchZero ({
                  onNonZero: (a: ordering.Ordering) => option.some (a),
                  onZero: option.zero,
                }),
              ),
            // If length of the first array is more than length of the second then first array is more than second
            onNone: () => option.some (1 as const),
          }),
        ),
      ),
      // In the case when unequal elements was not found and length of the first array is less than length of the second
      // then the first array is less than the second. Otherwise both arrays are the same
      option.getOrElse (() =>
        pipe (
          length (ys) > length (xs),
          boolean.match ({
            onTrue: constant (-1 as const),
            onFalse: constant (0 as const),
          }),
        ),
      ),
    ),
})
