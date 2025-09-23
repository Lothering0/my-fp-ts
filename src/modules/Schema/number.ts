import * as result from "../Result"
import { pipe } from "../../utils/flow"
import { isBigInt, isNumber } from "../../utils/typeChecks"
import { Schema, create } from "./schema"
import { message } from "./validation"

const number: Schema<number> = create (x => {
  if (!isNumber (x)) {
    return result.fail ([message`value ${x} is not a number`])
  }
  return result.succeed (x)
})

export { number as Number }

export const Integer: Schema<number> = create (x => {
  if (!Number.isInteger (x)) {
    return result.fail ([message`value ${x} is not an integer`])
  }
  return result.succeed (x as number)
})

export const BigInt: Schema<bigint> = create (x => {
  if (!isBigInt (x)) {
    return result.fail ([message`value ${x} is not a BigInt`])
  }
  return result.succeed (x)
})

export const min =
  (min: number) =>
  <A extends number>(self: Schema<A>): Schema<A> =>
    create (x => {
      const validationResult = self.validate (x)
      if (result.isFailure (validationResult)) {
        return validationResult
      }
      const n = Number (x) as A
      if (n < min) {
        return result.fail ([
          message`value should not be less than ${min}, got ${n}`,
        ])
      }
      return result.succeed (n)
    })

export const max =
  (max: number) =>
  <A extends number>(self: Schema<A>): Schema<A> =>
    create (x => {
      const validationResult = self.validate (x)
      if (result.isFailure (validationResult)) {
        return validationResult
      }
      const n = Number (x) as A
      if (n > max) {
        return result.fail ([
          message`value should not be greater than ${max}, got ${n}`,
        ])
      }
      return result.succeed (n)
    })

export const NonNegative: Schema<number> = pipe (number, min (0))

export const NonNegativeInteger: Schema<number> = pipe (Integer, min (0))

export const PositiveInteger: Schema<number> = pipe (Integer, min (1))
