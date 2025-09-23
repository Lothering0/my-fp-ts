import { pipe, result, schema } from "../../../src"

describe ("Number", () => {
  it ("should correctly check is value a number", () => {
    pipe (schema.proceedUnknown (schema.Number) (undefined), expect).toEqual (
      result.fail (["value `undefined` is not a number"]),
    )
    pipe (schema.proceed (schema.Number) (1), expect).toEqual (result.succeed (1))
    pipe (schema.proceedUnknown (schema.Number) (true), expect).toEqual (
      result.fail (["value `true` is not a number"]),
    )
  })
})

describe ("Integer", () => {
  it ("should correctly check is value an integer", () => {
    pipe (schema.validateUnknown (schema.Integer) (undefined), expect).toBe (false)
    pipe (schema.validateUnknown (schema.Integer) (0), expect).toBe (true)
    pipe (schema.validateUnknown (schema.Integer) (1), expect).toBe (true)
    pipe (schema.validateUnknown (schema.Integer) (1.5), expect).toBe (false)
  })
})

describe ("BigInt", () => {
  it ("should correctly check is value a big integer", () => {
    pipe (schema.validateUnknown (schema.BigInt) (undefined), expect).toBe (false)
    pipe (schema.validateUnknown (schema.BigInt) (1), expect).toBe (false)
    pipe (schema.validateUnknown (schema.BigInt) (1n), expect).toBe (true)
  })
})

describe ("Min", () => {
  it ("should correctly check is value a big integer", () => {
    const NonNegative = pipe (schema.Number, schema.min (0))

    pipe (schema.validateUnknown (NonNegative) (undefined), expect).toBe (false)
    pipe (schema.validateUnknown (NonNegative) (0), expect).toBe (true)
    pipe (schema.validateUnknown (NonNegative) (1), expect).toBe (true)
    pipe (schema.validateUnknown (NonNegative) (-1), expect).toBe (false)
  })
})

describe ("Max", () => {
  it ("should correctly check is value a big integer", () => {
    const NonNegative = pipe (schema.Number, schema.max (0))

    pipe (schema.validateUnknown (NonNegative) (undefined), expect).toBe (false)
    pipe (schema.validateUnknown (NonNegative) (0), expect).toBe (true)
    pipe (schema.validateUnknown (NonNegative) (1), expect).toBe (false)
    pipe (schema.validateUnknown (NonNegative) (-1), expect).toBe (true)
  })
})
