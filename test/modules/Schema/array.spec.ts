import { pipe, schema } from "../../../src"

describe ("Array", () => {
  it ("should validate an array", () => {
    const Numbers = schema.Array (schema.Number)
    pipe ([], schema.validate (Numbers), expect).toBe (true)
    pipe (["a"], schema.validateUnknown (Numbers), expect).toBe (false)
    pipe ([1, 2, 3], schema.validate (Numbers), expect).toBe (true)
    pipe ([1, "a", 3], schema.validateUnknown (Numbers), expect).toBe (false)
    pipe (undefined, schema.validate (Numbers), expect).toBe (false)
  })
})

describe ("NonEmptyArray", () => {
  it ("should validate a non-empty array", () => {
    const Numbers = schema.NonEmptyArray (schema.Number)
    pipe ([], schema.validateUnknown (Numbers), expect).toBe (false)
    pipe (["a"], schema.validateUnknown (Numbers), expect).toBe (false)
    pipe ([1, 2, 3], schema.validate (Numbers), expect).toBe (true)
    pipe ([1, "a", 3], schema.validateUnknown (Numbers), expect).toBe (false)
    pipe (undefined, schema.validate (Numbers), expect).toBe (false)
  })
})
