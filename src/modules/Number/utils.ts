import * as Option from '../Option'
import * as Boolean from '../Boolean'
import { Predicate } from '../Predicate'
import { flow } from '../../utils/flow'
import { constant } from '../../utils/constant'
import { matchNegative } from './matchers'
import { identity } from '../Identity'

export const add: {
  (y: number): (x: number) => number
} = y => x => x + y

export const subtract: {
  (y: number): (x: number) => number
} = y => x => x - y

export const multiply: {
  (y: number): (x: number) => number
} = y => x => x * y

export const divide: {
  (y: number): (x: number) => number
} = y => x => x / y

export const divideSafe: {
  (y: number): (x: number) => Option.Option<number>
} = y => x => (y === 0 ? Option.none() : Option.some(x / y))

export const lessThan: {
  (y: number): (x: number) => boolean
} = y => x => x < y

export const lessThanOrEquals: {
  (y: number): (x: number) => boolean
} = y => x => x <= y

export const moreThan: {
  (y: number): (x: number) => boolean
} = y => x => x > y

export const moreThanOrEquals: {
  (y: number): (x: number) => boolean
} = y => x => x >= y

export const isEven: Predicate<number> = x => x % 2 === 0

export const isOdd: Predicate<number> = flow(isEven, Boolean.not)

export const toNonNegative: {
  (self: number): number
} = matchNegative({
  onNegative: constant(0),
  onNonNegative: identity,
})

export const toFixedString: {
  (fractionDigits: number): (self: number) => string
} = fractionDigits => self => self.toFixed(fractionDigits)

export const toFixed: {
  (fractionDigits: number): (self: number) => number
} = fractionDigits => flow(toFixedString(fractionDigits), Number)
