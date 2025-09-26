import * as number from '../Number'
import { pipe } from '../../utils/flow'
import { length } from './utils'

export const isEmpty = (self: string): self is '' =>
  pipe(self, length, number.equals(0))
