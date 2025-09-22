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

    pipe (user, schema.check (User), expect).toEqual (
      result.succeed ({
        id: 1,
        name: "John",
        isActive: false,
      }),
    )
  })

  it ("should not pass invalid values", () => {
    pipe (undefined, schema.check (User), expect).toEqual (
      result.fail (["value `undefined` is not a struct"]),
    )
    pipe ({}, schema.checkUnknown (User), expect).toEqual (
      result.fail ([
        'property "id" is required',
        'property "name" is required',
        'property "isActive" is required',
      ]),
    )
    pipe (
      {
        id: 1,
        name: "John",
        isActive: false,
        createdAt: new Date (),
      },
      schema.checkUnknown (User),
      expect,
    ).toEqual (result.fail (['property "createdAt" should not exist']))
    pipe (
      {
        id: "1",
        name: 2,
        isActive: false,
      },
      schema.checkUnknown (User),
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
  const Keys = schema.keyof (User)

  it ("should correctly extract keys of struct schema", () => {
    pipe (undefined, schema.check (Keys), expect).toEqual (
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
    schema.validate (UserWithoutId) ({
      name: "John",
      isActive: true,
    }),
    expect,
  ).toBe (true)
  pipe (
    schema.checkUnknown (UserWithoutId) ({
      id: 1,
      name: "John",
      isActive: true,
    }),
    expect,
  ).toEqual (result.fail (['property "id" should not exist']))
}

describe ("omit", () => {
  const UserWithoutId = pipe (User, schema.omit ("id"))

  it ("should return struct without provided keys", () => {
    testUserWithoutId (UserWithoutId)
  })
})

describe ("pick", () => {
  const UserWithoutId = pipe (User, schema.pick ("name", "isActive"))

  it ("should return struct without provided keys", () => {
    testUserWithoutId (UserWithoutId)
  })
})

describe ("partial", () => {
  const PartialUser = pipe (User, schema.partial)

  it ("should return struct without required properties", () => {
    pipe (
      schema.validate (PartialUser) ({
        id: 1,
        name: "John",
        isActive: false,
      }),
      expect,
    ).toBe (true)
  })
})
