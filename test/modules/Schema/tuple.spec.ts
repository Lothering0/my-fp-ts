import { pipe, result, schema } from "../../../src"

describe ("Tuple", () => {
  it ("it should correctly validate by schema of tuple without elements", () => {
    const Tuple = schema.Tuple ()
    pipe (schema.validateUnknown (Tuple) (undefined), expect).toBe (false)
    pipe (schema.proceed (Tuple) ([]), expect).toEqual (result.succeed ([]))
    pipe (schema.validateUnknown (Tuple) ([1]), expect).toBe (false)
    pipe (schema.validateUnknown (Tuple) ([1, "a"]), expect).toBe (false)
    pipe (schema.validateUnknown (Tuple) (["a", "a"]), expect).toBe (false)
    pipe (schema.validateUnknown (Tuple) ([1, 1]), expect).toBe (false)
  })

  it ("it should correctly validate by schema of tuple with two elements", () => {
    const Tuple = schema.Tuple (schema.Number, schema.String)
    pipe (schema.validateUnknown (Tuple) (undefined), expect).toBe (false)
    pipe (schema.validateUnknown (Tuple) ([]), expect).toBe (false)
    pipe (schema.validateUnknown (Tuple) ([1]), expect).toBe (false)
    pipe (schema.proceed (Tuple) ([1, "a"]), expect).toEqual (
      result.succeed ([1, "a"]),
    )
  })

  it ("it should correctly validate by schema of tuple with one required and one optional element", () => {
    const Tuple = schema.Tuple (schema.Number, schema.optional (schema.String))
    pipe (schema.validateUnknown (Tuple) (undefined), expect).toBe (false)
    pipe (schema.validateUnknown (Tuple) ([]), expect).toBe (false)
    pipe (schema.proceed (Tuple) ([1]), expect).toEqual (result.succeed ([1]))
    pipe (schema.proceed (Tuple) ([1, "a"]), expect).toEqual (
      result.succeed ([1, "a"]),
    )
    pipe (schema.validateUnknown (Tuple) ([1, 1]), expect).toBe (false)
    pipe (schema.proceed (Tuple) ([1, undefined]), expect).toEqual (
      result.succeed ([1, undefined]),
    )
  })
})
