import { pipe, Result, Schema } from '../../../src'

describe('Record', () => {
  it('should check is value a valid record', () => {
    const RecordKeys = pipe(Schema.exact('a'), Schema.union(Schema.exact('b')))
    const Record = Schema.Record({
      key: RecordKeys,
      value: Schema.Number,
    })
    pipe(Schema.proceedUnknown(Record)(undefined), expect).toEqual(
      Result.fail(['value `undefined` is not a record']),
    )
    pipe(Schema.proceed(Record)({}), expect).toEqual(Result.succeed({}))
    pipe(Schema.proceed(Record)({ a: 1 }), expect).toEqual(
      Result.succeed({ a: 1 }),
    )
    pipe(Schema.proceed(Record)({ a: 1, b: 2 }), expect).toEqual(
      Result.succeed({ a: 1, b: 2 }),
    )
    pipe(Schema.proceedUnknown(Record)({ a: false }), expect).toEqual(
      Result.fail(['on property "a": value `false` is not a number']),
    )
    pipe(Schema.proceedUnknown(Record)({ a: false, b: 1 }), expect).toEqual(
      Result.fail(['on property "a": value `false` is not a number']),
    )
    pipe(Schema.proceedUnknown(Record)({ a: 1, b: true }), expect).toEqual(
      Result.fail(['on property "b": value `true` is not a number']),
    )
    pipe(Schema.proceedUnknown(Record)({ a: false, b: true }), expect).toEqual(
      Result.fail([
        'on property "a": value `false` is not a number',
        'on property "b": value `true` is not a number',
      ]),
    )
    pipe(
      Schema.proceedUnknown(Record)({ a: false, b: true, c: 3 }),
      expect,
    ).toEqual(
      Result.fail([
        'on property "a": value `false` is not a number',
        'on property "b": value `true` is not a number',
        'property "c": value "c" is not equal to "a"',
        'property "c": value "c" is not equal to "b"',
      ]),
    )
  })
})
