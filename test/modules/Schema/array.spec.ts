import { pipe, schema } from "../../../src"

describe ("array", () => {
  it ("should validate an array", () => {
    const numbers = schema.array (schema.number)
    pipe ([], schema.validate (numbers), expect).toBe (true)
    pipe (["a"], schema.validateUnknown (numbers), expect).toBe (false)
    pipe ([1, 2, 3], schema.validate (numbers), expect).toBe (true)
    pipe ([1, "a", 3], schema.validateUnknown (numbers), expect).toBe (false)
    pipe (undefined, schema.validate (numbers), expect).toBe (false)
  })

  it ("should validate a non-empty array", () => {
    const numbers = schema.nonEmptyArray (schema.number)
    pipe ([], schema.validateUnknown (numbers), expect).toBe (false)
    pipe (["a"], schema.validateUnknown (numbers), expect).toBe (false)
    pipe ([1, 2, 3], schema.validate (numbers), expect).toBe (true)
    pipe ([1, "a", 3], schema.validateUnknown (numbers), expect).toBe (false)
    pipe (undefined, schema.validate (numbers), expect).toBe (false)
  })
})
