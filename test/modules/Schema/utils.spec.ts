import { pipe, result, schema } from "../../../src"

describe ("exact", () => {
  it ("should check values by strict equivalence", () => {
    const Null = schema.exact (null)
    pipe (schema.validate (Null) (null), expect).toBe (true)
    pipe (schema.validateUnknown (Null) (undefined), expect).toBe (false)
  })
})

describe ("lazy", () => {
  interface Recursive {
    readonly id: number
    readonly parent?: Recursive
  }

  const Recursive = schema.Struct ({
    id: schema.Number,
    parent: pipe (
      schema.lazy ((): schema.Schema<Recursive> => Recursive),
      schema.optional,
    ),
  })

  it ("should check value recursively", () => {
    pipe (schema.validate (Recursive) ({ id: 1 }), expect).toBe (true)
    pipe (schema.validateUnknown (Recursive) ({ id: "a" }), expect).toBe (false)
    pipe (schema.validate (Recursive) ({ id: 2, parent: { id: 1 } }), expect).toBe (
      true,
    )
    pipe (
      schema.validateUnknown (Recursive) ({ id: 2, parent: { id: "a" } }),
      expect,
    ).toBe (false)
    pipe (
      schema.validate (Recursive) ({
        id: 3,
        parent: { id: 2, parent: { id: 1 } },
      }),
      expect,
    ).toBe (true)
    pipe (
      schema.validateUnknown (Recursive) ({
        id: "a",
        parent: { id: 2, parent: { id: 1 } },
      }),
      expect,
    ).toBe (false)
    pipe (
      schema.validateUnknown (Recursive) ({
        id: 3,
        parent: { id: "b", parent: { id: 1 } },
      }),
      expect,
    ).toBe (false)
    pipe (
      schema.validateUnknown (Recursive) ({
        id: 3,
        parent: { id: 2, parent: { id: "c" } },
      }),
      expect,
    ).toBe (false)
  })
})

describe ("instanceOf", () => {
  it ("should correctly check is value an instance of a class", () => {
    const ErrorInstance = schema.instanceOf (Error)
    pipe (schema.validateUnknown (ErrorInstance) (undefined), expect).toBe (false)
    pipe (schema.validateUnknown (ErrorInstance) ([]), expect).toBe (false)
    pipe (schema.validateUnknown (ErrorInstance) (Error), expect).toBe (false)
    pipe (schema.validate (ErrorInstance) (new Error ()), expect).toBe (true)
    pipe (schema.validate (ErrorInstance) (new TypeError ()), expect).toBe (true)
  })
})

describe ("union", () => {
  it ("should union two schemas", () => {
    const NumberOrString = pipe (schema.Number, schema.union (schema.String))
    pipe (schema.validateUnknown (NumberOrString) (undefined), expect).toBe (false)
    pipe (schema.validate (NumberOrString) ("a"), expect).toBe (true)
    pipe (schema.validate (NumberOrString) (1), expect).toBe (true)
    pipe (schema.validateUnknown (NumberOrString) (true), expect).toBe (false)
  })
})

describe ("minLength", () => {
  it ("should correctly validate length of a string", () => {
    const StringSchema = pipe (schema.String, schema.minLength (2))
    pipe (schema.check (StringSchema) (""), expect).toEqual (
      result.fail (["value length should not be less than 2, got 0"]),
    )
    pipe (schema.check (StringSchema) ("a"), expect).toEqual (
      result.fail (["value length should not be less than 2, got 1"]),
    )
    pipe (schema.validate (StringSchema) ("ab"), expect).toBe (true)
    pipe (schema.validate (StringSchema) ("abc"), expect).toBe (true)
  })

  it ("should correctly validate length of an array", () => {
    const ArraySchema = pipe (schema.Number, schema.Array, schema.minLength (2))
    pipe (schema.check (ArraySchema) ([]), expect).toEqual (
      result.fail (["value length should not be less than 2, got 0"]),
    )
    pipe (schema.check (ArraySchema) ([1]), expect).toEqual (
      result.fail (["value length should not be less than 2, got 1"]),
    )
    pipe (schema.validate (ArraySchema) ([1, 2]), expect).toBe (true)
    pipe (schema.validate (ArraySchema) ([1, 2, 3]), expect).toBe (true)
  })
})

describe ("maxLength", () => {
  it ("should correctly validate length of a string", () => {
    const StringSchema = pipe (schema.String, schema.maxLength (2))
    pipe (schema.validate (StringSchema) (""), expect).toBe (true)
    pipe (schema.validate (StringSchema) ("a"), expect).toBe (true)
    pipe (schema.validate (StringSchema) ("ab"), expect).toBe (true)
    pipe (schema.check (StringSchema) ("abc"), expect).toEqual (
      result.fail (["value length should not be greater than 2, got 3"]),
    )
  })

  it ("should correctly validate length of an array", () => {
    const ArraySchema = pipe (schema.Number, schema.Array, schema.maxLength (2))
    pipe (schema.validate (ArraySchema) ([]), expect).toBe (true)
    pipe (schema.validate (ArraySchema) ([1]), expect).toBe (true)
    pipe (schema.validate (ArraySchema) ([1, 2]), expect).toBe (true)
    pipe (schema.check (ArraySchema) ([1, 2, 3]), expect).toEqual (
      result.fail (["value length should not be greater than 2, got 3"]),
    )
  })
})
