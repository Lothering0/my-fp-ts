import { pipe, schema } from "../../../src"

describe ("tuple", () => {
  it ("it should correctly validate by schema of tuple without elements", () => {
    const tupleSchema = schema.tuple ()
    pipe ([], schema.validateUnknown (tupleSchema), expect).toBe (true)
    pipe ([1], schema.validateUnknown (tupleSchema), expect).toBe (false)
    pipe ([1, "a"], schema.validateUnknown (tupleSchema), expect).toBe (false)
    pipe (["a", "a"], schema.validateUnknown (tupleSchema), expect).toBe (false)
    pipe ([1, 1], schema.validateUnknown (tupleSchema), expect).toBe (false)
    pipe (undefined, schema.validateUnknown (tupleSchema), expect).toBe (false)
  })

  it ("it should correctly validate by schema of tuple with two elements", () => {
    const tupleSchema = schema.tuple (schema.number, schema.string)
    pipe ([], schema.validateUnknown (tupleSchema), expect).toBe (false)
    pipe ([1], schema.validateUnknown (tupleSchema), expect).toBe (false)
    pipe ([1, "a"], schema.validateUnknown (tupleSchema), expect).toBe (true)
    pipe (undefined, schema.validateUnknown (tupleSchema), expect).toBe (false)
  })

  it ("it should correctly validate by schema of tuple with one required and one optional element", () => {
    const tupleSchema = schema.tuple (
      schema.number,
      schema.optional (schema.string),
    )
    pipe ([], schema.validateUnknown (tupleSchema), expect).toBe (false)
    pipe ([1], schema.validateUnknown (tupleSchema), expect).toBe (true)
    pipe ([1, "a"], schema.validateUnknown (tupleSchema), expect).toBe (true)
    pipe ([1, 1], schema.validateUnknown (tupleSchema), expect).toBe (false)
    pipe ([1, undefined], schema.validateUnknown (tupleSchema), expect).toBe (true)
    pipe (undefined, schema.validateUnknown (tupleSchema), expect).toBe (false)
  })
})
