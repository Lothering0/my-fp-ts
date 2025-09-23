import { pipe, result, schema } from "../../../src"

const User = schema.Struct ({
  id: schema.PositiveInteger,
  name: pipe (schema.String, schema.minLength (2), schema.maxLength (20)),
  isActive: schema.Boolean,
})
type User = schema.Type<typeof User>

describe ("Struct", () => {
  it ("should pass object that matches a struct", () => {
    const user: User = {
      id: 1,
      name: "John",
      isActive: false,
    }

    pipe (schema.check (User) (user), expect).toEqual (
      result.succeed ({
        id: 1,
        name: "John",
        isActive: false,
      }),
    )
  })

  it ("should not pass invalid values", () => {
    pipe (schema.checkUnknown (User) (undefined), expect).toEqual (
      result.fail (["value `undefined` is not a struct"]),
    )
    pipe (schema.checkUnknown (User) ({}), expect).toEqual (
      result.fail ([
        'property "id" is required',
        'property "name" is required',
        'property "isActive" is required',
      ]),
    )
    pipe (
      schema.checkUnknown (User) ({
        id: 1,
        name: "John",
        isActive: false,
        createdAt: new Date (),
      }),
      expect,
    ).toEqual (result.fail (['property "createdAt" should not exist']))
    pipe (
      schema.checkUnknown (User) ({
        id: "1",
        name: 2,
        isActive: false,
      }),
      expect,
    ).toEqual (
      result.fail ([
        'on property "id": value "1" is not an integer',
        'on property "name": value `2` is not a string',
      ]),
    )
  })
})

describe ("keyof", () => {
  it ("should correctly extract keys of struct schema", () => {
    const Keys = schema.keyof (User)
    pipe (schema.checkUnknown (Keys) (undefined), expect).toEqual (
      result.fail ([
        'got `undefined`, expected one of the following values: "id", "name", "isActive"',
      ]),
    )
    pipe (schema.validateUnknown (Keys) (""), expect).toBe (false)
    pipe (schema.validateUnknown (Keys) ("a"), expect).toBe (false)
    pipe (schema.validate (Keys) ("id"), expect).toBe (true)
  })
})

const testUserWithoutId = (
  UserWithoutId: schema.StructSchema<{
    name: schema.Schema<string>
    isActive: schema.Schema<boolean>
  }>,
) => {
  pipe (schema.validateUnknown (UserWithoutId) (undefined), expect).toBe (false)
  pipe (
    schema.validate (UserWithoutId) ({ name: "John", isActive: true }),
    expect,
  ).toBe (true)
  pipe (
    schema.checkUnknown (UserWithoutId) ({ id: 1, name: "John", isActive: true }),
    expect,
  ).toEqual (result.fail (['property "id" should not exist']))
}

describe ("omit", () => {
  it ("should return struct without provided keys", () => {
    const UserWithoutId = pipe (User, schema.omit ("id"))
    testUserWithoutId (UserWithoutId)
  })
})

describe ("pick", () => {
  it ("should return struct without provided keys", () => {
    const UserWithoutId = pipe (User, schema.pick ("name", "isActive"))
    testUserWithoutId (UserWithoutId)
  })
})

describe ("partial", () => {
  it ("should return struct without required properties", () => {
    const PartialUser = pipe (User, schema.partial)
    pipe (schema.validate (PartialUser) ({}), expect).toBe (true)
    pipe (
      schema.validate (PartialUser) ({ name: "John", isActive: false }),
      expect,
    ).toBe (true)
    pipe (schema.validate (PartialUser) ({ isActive: false }), expect).toBe (true)
    pipe (
      schema.validate (PartialUser) ({ id: 1, name: "John", isActive: false }),
      expect,
    ).toBe (true)
  })
})

describe ("required", () => {
  it ("should return struct with all required properties", () => {
    const PartialUser = pipe (User, schema.partial, schema.required)
    pipe (schema.validateUnknown (PartialUser) ({}), expect).toBe (false)
    pipe (
      schema.checkUnknown (PartialUser) ({ name: "John", isActive: false }),
      expect,
    ).toEqual (result.fail (['property "id" is required']))
    pipe (schema.checkUnknown (PartialUser) ({ isActive: false }), expect).toEqual (
      result.fail (['property "id" is required', 'property "name" is required']),
    )
    pipe (
      schema.validate (PartialUser) ({ id: 1, name: "John", isActive: false }),
      expect,
    ).toBe (true)
  })
})
