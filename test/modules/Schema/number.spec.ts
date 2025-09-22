import { pipe, result, schema } from "../../../src"

describe ("Number", () => {
  it ("should correctly check is value a number", () => {
    pipe (1, schema.check (schema.Number), expect).toEqual (result.succeed (1))
    pipe (true, schema.checkUnknown (schema.Number), expect).toEqual (
      result.fail (["value `true` is not a number"]),
    )
    pipe (undefined, schema.checkUnknown (schema.Number), expect).toEqual (
      result.fail (["value `undefined` is not a number"]),
    )
  })
})

describe ("Integer", () => {
  it ("should correctly check is value an integer", () => {
    pipe (0, schema.validateUnknown (schema.Integer), expect).toBe (true)
    pipe (1, schema.validateUnknown (schema.Integer), expect).toBe (true)
    pipe (1.5, schema.validateUnknown (schema.Integer), expect).toBe (false)
    pipe (undefined, schema.validateUnknown (schema.Integer), expect).toBe (false)
  })
})

describe ("BigInt", () => {
  it ("should correctly check is value a big integer", () => {
    pipe (1, schema.validateUnknown (schema.BigInt), expect).toBe (false)
    pipe (1n, schema.validateUnknown (schema.BigInt), expect).toBe (true)
    pipe (undefined, schema.validateUnknown (schema.BigInt), expect).toBe (false)
  })
})

describe ("Min", () => {
  it ("should correctly check is value a big integer", () => {
    const NonNegative = pipe (schema.Number, schema.min (0))

    pipe (0, schema.validateUnknown (NonNegative), expect).toBe (true)
    pipe (1, schema.validateUnknown (NonNegative), expect).toBe (true)
    pipe (-1, schema.validateUnknown (NonNegative), expect).toBe (false)
    pipe (undefined, schema.validateUnknown (NonNegative), expect).toBe (false)
  })
})

describe ("Max", () => {
  it ("should correctly check is value a big integer", () => {
    const NonNegative = pipe (schema.Number, schema.max (0))

    pipe (0, schema.validateUnknown (NonNegative), expect).toBe (true)
    pipe (1, schema.validateUnknown (NonNegative), expect).toBe (false)
    pipe (-1, schema.validateUnknown (NonNegative), expect).toBe (true)
    pipe (undefined, schema.validateUnknown (NonNegative), expect).toBe (false)
  })
})
