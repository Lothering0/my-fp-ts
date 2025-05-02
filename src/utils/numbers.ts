import * as O from "../modules/option"

type Add = (x: number) => (y: number) => number
export const add: Add = x => y => x + y

type Subtract = (x: number) => (y: number) => number
export const subtract: Subtract = x => y => x - y

type Multiply = (x: number) => (y: number) => number
export const multiply: Multiply = x => y => x * y

type Divide = (x: number) => (y: number) => number
export const divide: Divide = x => y => x / y

type DivideSafe = (x: number) => (y: number) => O.Option<number>
export const divideSafe: DivideSafe = x => y =>
  y === 0 ? O.none : O.some (x / y)
