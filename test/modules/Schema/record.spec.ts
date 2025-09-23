import { pipe, result, schema } from "../../../src"

describe ("Record", () => {
  it ("should check is value a valid record", () => {
    const RecordKeys = pipe (schema.exact ("a"), schema.union (schema.exact ("b")))
    const Record = schema.Record ({
      key: RecordKeys,
      value: schema.Number,
    })
    pipe (schema.checkUnknown (Record) (undefined), expect).toEqual (
      result.fail (["value `undefined` is not a record"]),
    )
    pipe (schema.check (Record) ({}), expect).toEqual (result.succeed ({}))
    pipe (schema.check (Record) ({ a: 1 }), expect).toEqual (
      result.succeed ({ a: 1 }),
    )
    pipe (schema.check (Record) ({ a: 1, b: 2 }), expect).toEqual (
      result.succeed ({ a: 1, b: 2 }),
    )
    pipe (schema.checkUnknown (Record) ({ a: false }), expect).toEqual (
      result.fail (['on property "a": value `false` is not a number']),
    )
    pipe (schema.checkUnknown (Record) ({ a: false, b: 1 }), expect).toEqual (
      result.fail (['on property "a": value `false` is not a number']),
    )
    pipe (schema.checkUnknown (Record) ({ a: 1, b: true }), expect).toEqual (
      result.fail (['on property "b": value `true` is not a number']),
    )
    pipe (schema.checkUnknown (Record) ({ a: false, b: true }), expect).toEqual (
      result.fail ([
        'on property "a": value `false` is not a number',
        'on property "b": value `true` is not a number',
      ]),
    )
    pipe (
      schema.checkUnknown (Record) ({ a: false, b: true, c: 3 }),
      expect,
    ).toEqual (
      result.fail ([
        'on property "a": value `false` is not a number',
        'on property "b": value `true` is not a number',
        'property "c": value "c" is not equal to "a"',
        'property "c": value "c" is not equal to "b"',
      ]),
    )
  })
})
