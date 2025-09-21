import { pipe, result, schema } from "../../../src"

describe ("record", () => {
  it ("should check is value a valid record", () => {
    const recordKeys = pipe (schema.exact ("a"), schema.union (schema.exact ("b")))
    const recordSchema = schema.record (recordKeys, schema.number)
    pipe (undefined, schema.check (recordSchema), expect).toEqual (
      result.fail (["value `undefined` is not a record"]),
    )
    pipe ({}, schema.check (recordSchema), expect).toEqual (result.succeed ({}))
    pipe ({ a: 1 }, schema.check (recordSchema), expect).toEqual (
      result.succeed ({ a: 1 }),
    )
    pipe ({ a: 1, b: 2 }, schema.check (recordSchema), expect).toEqual (
      result.succeed ({ a: 1, b: 2 }),
    )
    pipe ({ a: false }, schema.checkUnknown (recordSchema), expect).toEqual (
      result.fail (["on property `a`: value `false` is not a number"]),
    )
    pipe ({ a: false, b: 1 }, schema.checkUnknown (recordSchema), expect).toEqual (
      result.fail (["on property `a`: value `false` is not a number"]),
    )
    pipe ({ a: 1, b: true }, schema.checkUnknown (recordSchema), expect).toEqual (
      result.fail (["on property `b`: value `true` is not a number"]),
    )
    pipe (
      { a: false, b: true },
      schema.checkUnknown (recordSchema),
      expect,
    ).toEqual (
      result.fail ([
        "on property `a`: value `false` is not a number",
        "on property `b`: value `true` is not a number",
      ]),
    )
    pipe (
      { a: false, b: true, c: 3 },
      schema.checkUnknown (recordSchema),
      expect,
    ).toEqual (
      result.fail ([
        "on property `a`: value `false` is not a number",
        "on property `b`: value `true` is not a number",
        "property `c`: value `c` is not equal to `a`",
        "property `c`: value `c` is not equal to `b`",
      ]),
    )
  })
})
