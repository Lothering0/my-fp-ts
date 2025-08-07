import { pipe } from "../../utils/flow"
import { equals } from "./eq"
import { isEven, lessThan, lessThanOrEquals } from "./utils"

/** Match zero and positive or negative number */
export const matchZero: {
  <A, B = A>(
    onZero: (e: 0) => A,
    onNonZero: (a: number) => B,
  ): (self: number) => A | B
} = (onZero, onNonZero) => self =>
  pipe (self, equals (0)) ? onZero (0) : onNonZero (self)

/** Match negative and zero or positive number */
export const matchNegative: {
  <A, B = A>(
    onNegative: (e: number) => A,
    onNonNegative: (a: number) => B,
  ): (self: number) => A | B
} = (onNegative, onNonNegative) => self =>
  pipe (self, lessThan (0)) ? onNegative (self) : onNonNegative (self)

/** Match negative or zero and positive number */
export const matchNonPositive: {
  <A, B = A>(
    onNonPositive: (e: number) => A,
    onPositive: (a: number) => B,
  ): (self: number) => A | B
} = (onNonPositive, onPositive) => self =>
  pipe (self, lessThanOrEquals (0)) ? onNonPositive (self) : onPositive (self)

/** Match float and integer */
export const matchFloat: {
  <A, B = A>(
    onFloat: (e: number) => A,
    onInteger: (a: number) => B,
  ): (self: number) => A | B
} = (onFloat, onInteger) => self =>
  Number.isInteger (self) ? onInteger (self) : onFloat (self)

/** Match odd and even number */
export const matchOdd: {
  <A, B = A>(
    onOdd: (e: number) => A,
    onEven: (a: number) => B,
  ): (self: number) => A | B
} = (onOdd, onEven) => self => isEven (self) ? onEven (self) : onOdd (self)
