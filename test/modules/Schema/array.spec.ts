import { pipe, result, schema } from "../../../src"

describe ("Array", () => {
  it ("should validate an array", () => {
    const Numbers = schema.Array (schema.Number)
    pipe (schema.validateUnknown (Numbers) (undefined), expect).toBe (false)
    pipe (schema.proceed (Numbers) ([]), expect).toEqual (result.succeed ([]))
    pipe (schema.validateUnknown (Numbers) (["a"]), expect).toBe (false)
    pipe (schema.proceed (Numbers) ([1, 2, 3]), expect).toEqual (
      result.succeed ([1, 2, 3]),
    )
    pipe (schema.validateUnknown (Numbers) ([1, "a", 3]), expect).toBe (false)
  })
})

describe ("NonEmptyArray", () => {
  it ("should validate a non-empty array", () => {
    const Numbers = schema.NonEmptyArray (schema.Number)
    pipe (schema.validateUnknown (Numbers) (undefined), expect).toBe (false)
    pipe (schema.validateUnknown (Numbers) ([]), expect).toBe (false)
    pipe (schema.validateUnknown (Numbers) (["a"]), expect).toBe (false)
    pipe (schema.proceed (Numbers) ([1, 2, 3]), expect).toEqual (
      result.succeed ([1, 2, 3]),
    )
    pipe (schema.validateUnknown (Numbers) ([1, "a", 3]), expect).toBe (false)
  })
})
