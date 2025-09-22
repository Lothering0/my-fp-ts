import { pipe, result, schema } from "../../../src"

describe ("exact", () => {
  it ("should check values by strict equivalence", () => {
    const Null = schema.exact (null)
    pipe (null, schema.validate (Null), expect).toBe (true)
    pipe (undefined, schema.validate (Null), expect).toBe (false)
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
    pipe ({ id: 1 }, schema.validate (Recursive), expect).toBe (true)
    pipe ({ id: "a" }, schema.validateUnknown (Recursive), expect).toBe (false)
    pipe (
      {
        id: 2,
        parent: {
          id: 1,
        },
      },
      schema.validateUnknown (Recursive),
      expect,
    ).toBe (true)
    pipe (
      {
        id: 2,
        parent: {
          id: "a",
        },
      },
      schema.validateUnknown (Recursive),
      expect,
    ).toBe (false)
    pipe (
      {
        id: 3,
        parent: {
          id: 2,
          parent: {
            id: 1,
          },
        },
      },
      schema.validateUnknown (Recursive),
      expect,
    ).toBe (true)
    pipe (
      {
        id: "a",
        parent: {
          id: 2,
          parent: {
            id: 1,
          },
        },
      },
      schema.validateUnknown (Recursive),
      expect,
    ).toBe (false)
    pipe (
      {
        id: 3,
        parent: {
          id: "b",
          parent: {
            id: 1,
          },
        },
      },
      schema.validateUnknown (Recursive),
      expect,
    ).toBe (false)
    pipe (
      {
        id: 3,
        parent: {
          id: 2,
          parent: {
            id: "c",
          },
        },
      },
      schema.validateUnknown (Recursive),
      expect,
    ).toBe (false)
  })
})

describe ("instanceOf", () => {
  it ("should correctly check is value an instance of a class", () => {
    const ErrorInstance = schema.instanceOf (Error)
    pipe (undefined, schema.validate (ErrorInstance), expect).toBe (false)
    pipe ([], schema.validateUnknown (ErrorInstance), expect).toBe (false)
    pipe (Error, schema.validateUnknown (ErrorInstance), expect).toBe (false)
    pipe (new Error (), schema.validate (ErrorInstance), expect).toBe (true)
    pipe (new TypeError (), schema.validate (ErrorInstance), expect).toBe (true)
  })
})

describe ("union", () => {
  it ("should union two schemas", () => {
    const NumberOrString = pipe (schema.Number, schema.union (schema.String))
    pipe (undefined, schema.validate (NumberOrString), expect).toBe (false)
    pipe ("a", schema.validate (NumberOrString), expect).toBe (true)
    pipe (1, schema.validate (NumberOrString), expect).toBe (true)
    pipe (true, schema.validateUnknown (NumberOrString), expect).toBe (false)
  })
})

describe ("minLength", () => {
  it ("should correctly validate length of a string", () => {
    const StringSchema = pipe (schema.String, schema.minLength (2))
    pipe ("", schema.check (StringSchema), expect).toEqual (
      result.fail (["value length should not be less than 2, got 0"]),
    )
    pipe ("a", schema.check (StringSchema), expect).toEqual (
      result.fail (["value length should not be less than 2, got 1"]),
    )
    pipe ("ab", schema.validate (StringSchema), expect).toBe (true)
    pipe ("abc", schema.validate (StringSchema), expect).toBe (true)
  })

  it ("should correctly validate length of an array", () => {
    const ArraySchema = pipe (schema.Number, schema.Array, schema.minLength (2))
    pipe ([], schema.check (ArraySchema), expect).toEqual (
      result.fail (["value length should not be less than 2, got 0"]),
    )
    pipe ([1], schema.check (ArraySchema), expect).toEqual (
      result.fail (["value length should not be less than 2, got 1"]),
    )
    pipe ([1, 2], schema.validate (ArraySchema), expect).toBe (true)
    pipe ([1, 2, 3], schema.validate (ArraySchema), expect).toBe (true)
  })
})

describe ("maxLength", () => {
  it ("should correctly validate length of a string", () => {
    const StringSchema = pipe (schema.String, schema.maxLength (2))
    pipe ("", schema.validate (StringSchema), expect).toBe (true)
    pipe ("a", schema.validate (StringSchema), expect).toBe (true)
    pipe ("ab", schema.validate (StringSchema), expect).toBe (true)
    pipe ("abc", schema.check (StringSchema), expect).toEqual (
      result.fail (["value length should not be greater than 2, got 3"]),
    )
  })

  it ("should correctly validate length of an array", () => {
    const ArraySchema = pipe (schema.Number, schema.Array, schema.maxLength (2))
    pipe ([], schema.validate (ArraySchema), expect).toBe (true)
    pipe ([1], schema.validate (ArraySchema), expect).toBe (true)
    pipe ([1, 2], schema.validate (ArraySchema), expect).toBe (true)
    pipe ([1, 2, 3], schema.check (ArraySchema), expect).toEqual (
      result.fail (["value length should not be greater than 2, got 3"]),
    )
  })
})
