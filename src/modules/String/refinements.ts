import * as Number from '../Number'
import { pipe } from '../../utils/flow'
import { length } from './utils'

export const isEmpty = (self: string): self is '' =>
  pipe(self, length, Number.equals(0))

export const isNonEmpty = (self: string): boolean =>
  pipe(self, length, Number.moreThan(0))
