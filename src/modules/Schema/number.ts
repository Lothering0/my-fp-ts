import * as Result from '../Result'
import { pipe } from '../../utils/flow'
import { isBigInt, isNumber } from '../../utils/typeChecks'
import { Schema, create } from './schema'
import { message } from './process'

const number: Schema<number> = create(x => {
  if (!isNumber(x)) {
    return Result.fail([message`value ${x} is not a number`])
  }
  return Result.succeed(x)
})

export { number as Number }

export const Integer: Schema<number> = create(x => {
  if (!Number.isInteger(x)) {
    return Result.fail([message`value ${x} is not an integer`])
  }
  return Result.succeed(x as number)
})

export const BigInt: Schema<bigint> = create(x => {
  if (!isBigInt(x)) {
    return Result.fail([message`value ${x} is not a BigInt`])
  }
  return Result.succeed(x)
})

export const min =
  (min: number) =>
  <A extends number>(schema: Schema<A>): Schema<A> =>
    create(x => {
      const processResult = schema.proceed(x)
      if (Result.isFailure(processResult)) {
        return processResult
      }
      const n = Number(x) as A
      if (n < min) {
        return Result.fail([
          message`value should not be less than ${min}, got ${n}`,
        ])
      }
      return Result.succeed(n)
    })

export const max =
  (max: number) =>
  <A extends number>(schema: Schema<A>): Schema<A> =>
    create(x => {
      const processResult = schema.proceed(x)
      if (Result.isFailure(processResult)) {
        return processResult
      }
      const n = Number(x) as A
      if (n > max) {
        return Result.fail([
          message`value should not be greater than ${max}, got ${n}`,
        ])
      }
      return Result.succeed(n)
    })

export const NonNegative: Schema<number> = pipe(number, min(0))

export const NonNegativeInteger: Schema<number> = pipe(Integer, min(0))

export const PositiveInteger: Schema<number> = pipe(Integer, min(1))
