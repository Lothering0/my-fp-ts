import * as Array from '../ReadonlyArray'
import * as Order from '../../typeclasses/Order'
import { NonEmptyReadonlyArray } from './non-empty-readonly-array'

export const getOrder: {
  <A>(Order: Order.Order<A>): Order.Order<NonEmptyReadonlyArray<A>>
} = Array.getOrder
