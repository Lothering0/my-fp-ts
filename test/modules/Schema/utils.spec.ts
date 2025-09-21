import { pipe, result, schema } from "../../../src"

describe ("exact", () => {
  it ("should check values by strict equivalence", () => {
    const exactNull = schema.exact (null)
    pipe (null, schema.validate (exactNull), expect).toBe (true)
    pipe (undefined, schema.validate (exactNull), expect).toBe (false)
  })
})

describe ("instanceOf", () => {
  it ("should correctly check is value an instance of a class", () => {
    const errorSchema = schema.instanceOf (Error)
    pipe (undefined, schema.validate (errorSchema), expect).toBe (false)
    pipe ([], schema.validateUnknown (errorSchema), expect).toBe (false)
    pipe (Error, schema.validateUnknown (errorSchema), expect).toBe (false)
    pipe (new Error (), schema.validate (errorSchema), expect).toBe (true)
    pipe (new TypeError (), schema.validate (errorSchema), expect).toBe (true)
  })
})

describe ("union", () => {
  it ("should union two schemas", () => {
    const numberOrString = pipe (schema.number, schema.union (schema.string))
    pipe (undefined, schema.validate (numberOrString), expect).toBe (false)
    pipe ("a", schema.validate (numberOrString), expect).toBe (true)
    pipe (1, schema.validate (numberOrString), expect).toBe (true)
    pipe (true, schema.validateUnknown (numberOrString), expect).toBe (false)
  })
})

describe ("minLength", () => {
  it ("should correctly validate length of a string", () => {
    const stringSchema = pipe (schema.string, schema.minLength (2))
    pipe ("", schema.check (stringSchema), expect).toEqual (
      result.fail (["value length should not be less than 2, got 0"]),
    )
    pipe ("a", schema.check (stringSchema), expect).toEqual (
      result.fail (["value length should not be less than 2, got 1"]),
    )
    pipe ("ab", schema.validate (stringSchema), expect).toBe (true)
    pipe ("abc", schema.validate (stringSchema), expect).toBe (true)
  })

  it ("should correctly validate length of an array", () => {
    const arraySchema = pipe (schema.number, schema.array, schema.minLength (2))
    pipe ([], schema.check (arraySchema), expect).toEqual (
      result.fail (["value length should not be less than 2, got 0"]),
    )
    pipe ([1], schema.check (arraySchema), expect).toEqual (
      result.fail (["value length should not be less than 2, got 1"]),
    )
    pipe ([1, 2], schema.validate (arraySchema), expect).toBe (true)
    pipe ([1, 2, 3], schema.validate (arraySchema), expect).toBe (true)
  })
})

describe ("maxLength", () => {
  it ("should correctly validate length of a string", () => {
    const stringSchema = pipe (schema.string, schema.maxLength (2))
    pipe ("", schema.validate (stringSchema), expect).toBe (true)
    pipe ("a", schema.validate (stringSchema), expect).toBe (true)
    pipe ("ab", schema.validate (stringSchema), expect).toBe (true)
    pipe ("abc", schema.check (stringSchema), expect).toEqual (
      result.fail (["value length should not be greater than 2, got 3"]),
    )
  })

  it ("should correctly validate length of an array", () => {
    const arraySchema = pipe (schema.number, schema.array, schema.maxLength (2))
    pipe ([], schema.validate (arraySchema), expect).toBe (true)
    pipe ([1], schema.validate (arraySchema), expect).toBe (true)
    pipe ([1, 2], schema.validate (arraySchema), expect).toBe (true)
    pipe ([1, 2, 3], schema.check (arraySchema), expect).toEqual (
      result.fail (["value length should not be greater than 2, got 3"]),
    )
  })
})
