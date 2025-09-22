import { pipe, schema } from "../../../src"

describe ("Tuple", () => {
  it ("it should correctly validate by schema of tuple without elements", () => {
    const Tuple = schema.Tuple ()
    pipe ([], schema.validateUnknown (Tuple), expect).toBe (true)
    pipe ([1], schema.validateUnknown (Tuple), expect).toBe (false)
    pipe ([1, "a"], schema.validateUnknown (Tuple), expect).toBe (false)
    pipe (["a", "a"], schema.validateUnknown (Tuple), expect).toBe (false)
    pipe ([1, 1], schema.validateUnknown (Tuple), expect).toBe (false)
    pipe (undefined, schema.validateUnknown (Tuple), expect).toBe (false)
  })

  it ("it should correctly validate by schema of tuple with two elements", () => {
    const Tuple = schema.Tuple (schema.Number, schema.String)
    pipe ([], schema.validateUnknown (Tuple), expect).toBe (false)
    pipe ([1], schema.validateUnknown (Tuple), expect).toBe (false)
    pipe ([1, "a"], schema.validateUnknown (Tuple), expect).toBe (true)
    pipe (undefined, schema.validateUnknown (Tuple), expect).toBe (false)
  })

  it ("it should correctly validate by schema of tuple with one required and one optional element", () => {
    const Tuple = schema.Tuple (schema.Number, schema.optional (schema.String))
    pipe ([], schema.validateUnknown (Tuple), expect).toBe (false)
    pipe ([1], schema.validateUnknown (Tuple), expect).toBe (true)
    pipe ([1, "a"], schema.validateUnknown (Tuple), expect).toBe (true)
    pipe ([1, 1], schema.validateUnknown (Tuple), expect).toBe (false)
    pipe ([1, undefined], schema.validateUnknown (Tuple), expect).toBe (true)
    pipe (undefined, schema.validateUnknown (Tuple), expect).toBe (false)
  })
})
