import * as O from "./Option"
import { not } from "./Boolean"
import { Predicate } from "./Predicate"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"
import { Group } from "../types/Group"
import { flow } from "../utils/flow"
import { overload } from "../utils/overloads"

export const sumSemigroup: Semigroup<number> = {
  concat: (x, y) => x + y,
}

export const sumMonoid: Monoid<number> = {
  ...sumSemigroup,
  empty: 0,
}

export const sumGroup: Group<number> = {
  ...sumMonoid,
  inverse: a => -a,
}

export const productSemigroup: Semigroup<number> = {
  concat: (x, y) => x * y,
}

export const productMonoid: Monoid<number> = {
  ...productSemigroup,
  empty: 1,
}

export const productGroup: Group<number> = {
  ...productMonoid,
  inverse: a => 1 / a,
}

interface AddPointed {
  (a: number, b: number): number
}

interface AddPointFree {
  (b: number): (a: number) => number
}

interface Add extends AddPointed, AddPointFree {}

const addPointed: AddPointed = (a, b) => a + b
export const add: Add = overload (addPointed)

interface SubtractPointed {
  (a: number, b: number): number
}

interface SubtractPointFree {
  (b: number): (a: number) => number
}

interface Subtract extends SubtractPointed, SubtractPointFree {}

const subtractPointed: SubtractPointed = (a, b) => a - b
export const subtract: Subtract = overload (subtractPointed)

interface MultiplyPointed {
  (a: number, b: number): number
}

interface MultiplyPointFree {
  (b: number): (a: number) => number
}

interface Multiply extends MultiplyPointed, MultiplyPointFree {}

const multiplyPointed: MultiplyPointed = (a, b) => a * b
export const multiply: Multiply = overload (multiplyPointed)

interface DividePointed {
  (a: number, b: number): number
}

interface DividePointFree {
  (b: number): (a: number) => number
}

interface Divide extends DividePointed, DividePointFree {}

const dividePointed: DividePointed = (a, b) => a / b
export const divide: Divide = overload (dividePointed)

interface DivideSafePointed {
  (a: number, b: number): O.Option<number>
}

interface DivideSafePointFree {
  (b: number): (a: number) => O.Option<number>
}

interface DivideSafe extends DivideSafePointed, DivideSafePointFree {}

const divideSafePointed: DivideSafePointed = (a, b) =>
  b === 0 ? O.none : O.some (a / b)
export const divideSafe: DivideSafe = overload (divideSafePointed)

export const isEven: Predicate<number> = a => a % 2 === 0

export const isOdd: Predicate<number> = flow (isEven, not)
