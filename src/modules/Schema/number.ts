import * as boolean from "../../modules/Boolean"
import { pipe } from "../../utils/flow"
import { isBigInt, isNumber } from "../../utils/typeChecks"
import { Schema, create } from "./schema"
import { constValid, invalid, message, valid } from "./validation"

const number: Schema<number> = create (x =>
  pipe (
    x,
    isNumber,
    boolean.match ({
      onTrue: constValid,
      onFalse: () => invalid ([message`value ${x} is not a number`]),
    }),
  ),
)

export { number as Number }

export const Integer: Schema<number> = create (x =>
  pipe (
    x,
    Number.isInteger,
    boolean.match ({
      onTrue: constValid,
      onFalse: () => invalid ([message`value ${x} is not an integer`]),
    }),
  ),
)

export const BigInt: Schema<bigint> = create (x =>
  pipe (
    x,
    isBigInt,
    boolean.match ({
      onTrue: constValid,
      onFalse: () => invalid ([message`value ${x} is not a BigInt`]),
    }),
  ),
)

export const min: {
  (min: number): <A extends number>(self: Schema<A>) => Schema<A>
} = min => self =>
  create (x => {
    const { isValid, messages } = self.validate (x)
    if (!isValid) {
      return invalid (messages)
    }
    if (Number (x) < min) {
      return invalid ([message`value should not be less than ${min}, got ${x}`])
    }
    return valid
  })

export const max: {
  (max: number): <A extends number>(self: Schema<A>) => Schema<A>
} = max => self =>
  create (x => {
    const { isValid, messages } = self.validate (x)
    if (!isValid) {
      return invalid (messages)
    }
    if (Number (x) > max) {
      return invalid ([
        message`value should not be greater than ${max}, got ${x}`,
      ])
    }
    return valid
  })

export const NonNegative: Schema<number> = pipe (number, min (0))

export const NonNegativeInteger: Schema<number> = pipe (Integer, min (0))

export const PositiveInteger: Schema<number> = pipe (Integer, min (1))
