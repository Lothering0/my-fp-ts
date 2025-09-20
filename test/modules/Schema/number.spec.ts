import { pipe, result, schema } from "../../../src"

describe ("number", () => {
  it ("should correctly check is value a number", () => {
    pipe (1, schema.check (schema.number), expect).toEqual (result.succeed (1))
    pipe (true, schema.checkUnknown (schema.number), expect).toEqual (
      result.fail (["value true is not a number"]),
    )
    pipe (undefined, schema.checkUnknown (schema.number), expect).toEqual (
      result.fail (["value undefined is not a number"]),
    )
  })
})

describe ("integer", () => {
  it ("should correctly check is value an integer", () => {
    pipe (0, schema.validateUnknown (schema.integer), expect).toBe (true)
    pipe (1, schema.validateUnknown (schema.integer), expect).toBe (true)
    pipe (1.5, schema.validateUnknown (schema.integer), expect).toBe (false)
    pipe (undefined, schema.validateUnknown (schema.integer), expect).toBe (false)
  })
})

describe ("bigInt", () => {
  it ("should correctly check is value a big integer", () => {
    pipe (1, schema.validateUnknown (schema.bigInt), expect).toBe (false)
    pipe (1n, schema.validateUnknown (schema.bigInt), expect).toBe (true)
    pipe (undefined, schema.validateUnknown (schema.bigInt), expect).toBe (false)
  })
})

describe ("min", () => {
  it ("should correctly check is value a big integer", () => {
    const nonNegative = pipe (schema.number, schema.min (0))

    pipe (0, schema.validateUnknown (nonNegative), expect).toBe (true)
    pipe (1, schema.validateUnknown (nonNegative), expect).toBe (true)
    pipe (-1, schema.validateUnknown (nonNegative), expect).toBe (false)
    pipe (undefined, schema.validateUnknown (nonNegative), expect).toBe (false)
  })
})

describe ("max", () => {
  it ("should correctly check is value a big integer", () => {
    const nonNegative = pipe (schema.number, schema.max (0))

    pipe (0, schema.validateUnknown (nonNegative), expect).toBe (true)
    pipe (1, schema.validateUnknown (nonNegative), expect).toBe (false)
    pipe (-1, schema.validateUnknown (nonNegative), expect).toBe (true)
    pipe (undefined, schema.validateUnknown (nonNegative), expect).toBe (false)
  })
})
