import { pipe, result, schema } from '../../../src'

describe('DateLike', () => {
  it('should not pass invalid values which can be successfully applied to Date constructor', () => {
    pipe(schema.proceedUnknown(schema.DateLike)(undefined), expect).toEqual(
      result.fail([
        'value `undefined` is not a date instance, duration, string or a number of milliseconds',
      ]),
    )
  })

  it('should pass number of milliseconds', () => {
    pipe(schema.proceed(schema.DateLike)(-1))
    pipe(schema.proceed(schema.DateLike)(-1), expect).toEqual(
      result.succeed(new Date(-1)),
    )
    pipe(schema.proceed(schema.DateLike)(500), expect).toEqual(
      result.succeed(new Date(500)),
    )
    pipe(schema.proceed(schema.DateLike)(new Date(0)), expect).toEqual(
      result.succeed(new Date(0)),
    )
  })

  it('should pass ISO 8601 string', () => {
    const iso = '1970-05-01T00:05:00Z'
    pipe(schema.proceed(schema.DateLike)(iso), expect).toEqual(
      result.succeed(new Date(iso)),
    )
  })

  it('should pass duration input', () => {
    pipe(schema.proceed(schema.DateLike)('5 seconds'), expect).toEqual(
      result.succeed(new Date(5_000)),
    )
    pipe(schema.proceed(schema.DateLike)({ seconds: 5 }), expect).toEqual(
      result.succeed(new Date(5_000)),
    )
  })
})
