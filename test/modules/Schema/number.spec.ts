import { pipe, Result, Schema } from '../../../src'

describe('Number', () => {
  it('should correctly check is value a number', () => {
    pipe(Schema.proceedUnknown(Schema.Number)(undefined), expect).toEqual(
      Result.fail(['value `undefined` is not a number']),
    )
    pipe(Schema.proceed(Schema.Number)(1), expect).toEqual(Result.succeed(1))
    pipe(Schema.proceedUnknown(Schema.Number)(true), expect).toEqual(
      Result.fail(['value `true` is not a number']),
    )
  })
})

describe('Integer', () => {
  it('should correctly check is value an integer', () => {
    pipe(Schema.validateUnknown(Schema.Integer)(undefined), expect).toBe(false)
    pipe(Schema.proceedUnknown(Schema.Integer)(0), expect).toEqual(
      Result.succeed(0),
    )
    pipe(Schema.proceedUnknown(Schema.Integer)(1), expect).toEqual(
      Result.succeed(1),
    )
    pipe(Schema.validateUnknown(Schema.Integer)(1.5), expect).toBe(false)
  })
})

describe('BigInt', () => {
  it('should correctly check is value a big integer', () => {
    pipe(Schema.validateUnknown(Schema.BigInt)(undefined), expect).toBe(false)
    pipe(Schema.validateUnknown(Schema.BigInt)(1), expect).toBe(false)
    pipe(Schema.proceed(Schema.BigInt)(1n), expect).toEqual(Result.succeed(1n))
  })
})

describe('Min', () => {
  it('should correctly check is value a big integer', () => {
    const NonNegative = pipe(Schema.Number, Schema.min(0))

    pipe(Schema.validateUnknown(NonNegative)(undefined), expect).toBe(false)
    pipe(Schema.proceed(NonNegative)(0), expect).toEqual(Result.succeed(0))
    pipe(Schema.proceed(NonNegative)(1), expect).toEqual(Result.succeed(1))
    pipe(Schema.validate(NonNegative)(-1), expect).toBe(false)
  })
})

describe('Max', () => {
  it('should correctly check is value a big integer', () => {
    const NonPositive = pipe(Schema.Number, Schema.max(0))

    pipe(Schema.validateUnknown(NonPositive)(undefined), expect).toBe(false)
    pipe(Schema.proceed(NonPositive)(0), expect).toEqual(Result.succeed(0))
    pipe(Schema.validate(NonPositive)(1), expect).toBe(false)
    pipe(Schema.proceed(NonPositive)(-1), expect).toEqual(Result.succeed(-1))
  })
})
