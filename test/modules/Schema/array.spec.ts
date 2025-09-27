import { pipe, Result, Schema } from '../../../src'

describe('Array', () => {
  it('should validate an array', () => {
    const Numbers = Schema.Array(Schema.Number)
    pipe(Schema.validateUnknown(Numbers)(undefined), expect).toBe(false)
    pipe(Schema.proceed(Numbers)([]), expect).toEqual(Result.succeed([]))
    pipe(Schema.validateUnknown(Numbers)(['a']), expect).toBe(false)
    pipe(Schema.proceed(Numbers)([1, 2, 3]), expect).toEqual(
      Result.succeed([1, 2, 3]),
    )
    pipe(Schema.validateUnknown(Numbers)([1, 'a', 3]), expect).toBe(false)
  })
})

describe('NonEmptyArray', () => {
  it('should validate a non-empty array', () => {
    const Numbers = Schema.NonEmptyArray(Schema.Number)
    pipe(Schema.validateUnknown(Numbers)(undefined), expect).toBe(false)
    pipe(Schema.validateUnknown(Numbers)([]), expect).toBe(false)
    pipe(Schema.validateUnknown(Numbers)(['a']), expect).toBe(false)
    pipe(Schema.proceed(Numbers)([1, 2, 3]), expect).toEqual(
      Result.succeed([1, 2, 3]),
    )
    pipe(Schema.validateUnknown(Numbers)([1, 'a', 3]), expect).toBe(false)
  })
})
