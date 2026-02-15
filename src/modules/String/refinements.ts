import * as Number from '../Number'
import { pipe } from '../../utils/flow'
import { length } from './utils'

export const isEmpty = (string: string): string is '' =>
  pipe(string, length, Number.equals(0))

export const isNonEmpty = (string: string): boolean =>
  pipe(string, length, Number.moreThan(0))
