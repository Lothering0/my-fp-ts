import { pipe, Result, Schema } from '../../../src'

describe('DateLike', () => {
  it('should not pass invalid values which can be successfully applied to Date constructor', () => {
    pipe(Schema.proceedUnknown(Schema.DateLike)(undefined), expect).toEqual(
      Result.fail([
        'value `undefined` is not a date instance, duration, string or a number of milliseconds',
      ]),
    )
  })

  it('should pass number of milliseconds', () => {
    pipe(Schema.proceed(Schema.DateLike)(-1))
    pipe(Schema.proceed(Schema.DateLike)(-1), expect).toEqual(
      Result.succeed(new Date(-1)),
    )
    pipe(Schema.proceed(Schema.DateLike)(500), expect).toEqual(
      Result.succeed(new Date(500)),
    )
    pipe(Schema.proceed(Schema.DateLike)(new Date(0)), expect).toEqual(
      Result.succeed(new Date(0)),
    )
  })

  it('should pass ISO 8601 string', () => {
    const iso = '1970-05-01T00:05:00Z'
    pipe(Schema.proceed(Schema.DateLike)(iso), expect).toEqual(
      Result.succeed(new Date(iso)),
    )
  })

  it('should pass duration input', () => {
    pipe(Schema.proceed(Schema.DateLike)('5 seconds'), expect).toEqual(
      Result.succeed(new Date(5_000)),
    )
    pipe(Schema.proceed(Schema.DateLike)({ seconds: 5 }), expect).toEqual(
      Result.succeed(new Date(5_000)),
    )
  })
})
