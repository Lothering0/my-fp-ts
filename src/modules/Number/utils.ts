import * as option from "../Option"
import { not } from "../Boolean"
import { Predicate } from "../Predicate"
import { flow } from "../../utils/flow"

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
  (y: number): (x: number) => option.Option<number>
} = y => x => y === 0 ? option.none : option.some (x / y)

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

export const isOdd: Predicate<number> = flow (isEven, not)
