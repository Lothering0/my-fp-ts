import { pipe, result, schema } from "../../../src"

describe ("Record", () => {
  it ("should check is value a valid record", () => {
    const RecordKeys = pipe (schema.exact ("a"), schema.union (schema.exact ("b")))
    const Record = schema.Record ({
      key: RecordKeys,
      value: schema.Number,
    })
    pipe (undefined, schema.check (Record), expect).toEqual (
      result.fail (["value `undefined` is not a record"]),
    )
    pipe ({}, schema.check (Record), expect).toEqual (result.succeed ({}))
    pipe ({ a: 1 }, schema.check (Record), expect).toEqual (
      result.succeed ({ a: 1 }),
    )
    pipe ({ a: 1, b: 2 }, schema.check (Record), expect).toEqual (
      result.succeed ({ a: 1, b: 2 }),
    )
    pipe ({ a: false }, schema.checkUnknown (Record), expect).toEqual (
      result.fail (['on property "a": value `false` is not a number']),
    )
    pipe ({ a: false, b: 1 }, schema.checkUnknown (Record), expect).toEqual (
      result.fail (['on property "a": value `false` is not a number']),
    )
    pipe ({ a: 1, b: true }, schema.checkUnknown (Record), expect).toEqual (
      result.fail (['on property "b": value `true` is not a number']),
    )
    pipe ({ a: false, b: true }, schema.checkUnknown (Record), expect).toEqual (
      result.fail ([
        'on property "a": value `false` is not a number',
        'on property "b": value `true` is not a number',
      ]),
    )
    pipe (
      { a: false, b: true, c: 3 },
      schema.checkUnknown (Record),
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
