import * as Order_ from '../../typeclasses/Order'
import * as Number from '../Number'
import { flow } from '../../utils/flow'
import { Duration } from './duration'
import { toMilliseconds } from './utils'

export const Order: Order_.Order<Duration> = {
  compare: y => flow(toMilliseconds, Number.compare(toMilliseconds(y))),
}
