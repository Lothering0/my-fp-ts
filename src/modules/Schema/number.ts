import * as boolean from "../../modules/Boolean"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { isBigInt, isNumber } from "../../utils/typeChecks"
import { Schema } from "./schema"
import { constValid, invalid, valid } from "./validation"

export const number: Schema<number> = {
  Type: hole (),
  validate: x =>
    pipe (
      x,
      isNumber,
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([`value ${x} is not a number`]),
      }),
    ),
}

export const integer: Schema<number> = {
  Type: hole (),
  validate: x =>
    pipe (
      x,
      Number.isInteger,
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([`value ${x} is not an integer`]),
      }),
    ),
}

export const bigInt: Schema<bigint> = {
  Type: hole (),
  validate: x =>
    pipe (
      x,
      isBigInt,
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([`value ${x} is not a BigInt`]),
      }),
    ),
}

export const min: {
  (min: number): <A extends number>(self: Schema<A>) => Schema<A>
} = min => self => ({
  Type: hole (),
  validate: x => {
    const { isValid, messages } = self.validate (x)
    if (!isValid) {
      return invalid (messages)
    }
    if (Number (x) < min) {
      return invalid ([`value should not be less than ${min}, got ${x}`])
    }
    return valid
  },
})

export const max: {
  (max: number): <A extends number>(self: Schema<A>) => Schema<A>
} = max => self => ({
  Type: hole (),
  validate: x => {
    const { isValid, messages } = self.validate (x)
    if (!isValid) {
      return invalid (messages)
    }
    if (Number (x) > max) {
      return invalid ([`value should not be greater than ${max}, got ${x}`])
    }
    return valid
  },
})

export const nonNegative: Schema<number> = pipe (number, min (0))

export const nonNegativeInteger: Schema<number> = pipe (integer, min (0))

export const positiveInteger: Schema<number> = pipe (integer, min (1))
