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

    pipe (schema.proceed (User) (user), expect).toEqual (
      result.succeed ({
        id: 1,
        name: "John",
        isActive: false,
      }),
    )
  })

  it ("should not pass invalid values", () => {
    pipe (schema.proceedUnknown (User) (undefined), expect).toEqual (
      result.fail (["value `undefined` is not a struct"]),
    )
    pipe (schema.proceedUnknown (User) ({}), expect).toEqual (
      result.fail ([
        'property "id" is required',
        'property "name" is required',
        'property "isActive" is required',
      ]),
    )
    pipe (
      schema.proceedUnknown (User) ({
        id: 1,
        name: "John",
        isActive: false,
        createdAt: new Date (),
      }),
      expect,
    ).toEqual (result.fail (['property "createdAt" should not exist']))
    pipe (
      schema.proceedUnknown (User) ({
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
    pipe (schema.proceedUnknown (Keys) (undefined), expect).toEqual (
      result.fail ([
        'got `undefined`, expected one of the following values: "id", "name", "isActive"',
      ]),
    )
    pipe (schema.validateUnknown (Keys) (""), expect).toBe (false)
    pipe (schema.validateUnknown (Keys) ("a"), expect).toBe (false)
    pipe (schema.proceed (Keys) ("id"), expect).toEqual (result.succeed ("id"))
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
    schema.proceed (UserWithoutId) ({ name: "John", isActive: true }),
    expect,
  ).toEqual (result.succeed ({ name: "John", isActive: true }))
  pipe (
    schema.proceedUnknown (UserWithoutId) ({
      id: 1,
      name: "John",
      isActive: true,
    }),
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
    pipe (schema.proceed (PartialUser) ({}), expect).toEqual (result.succeed ({}))
    pipe (
      schema.proceed (PartialUser) ({ name: "John", isActive: false }),
      expect,
    ).toEqual (result.succeed ({ name: "John", isActive: false }))
    pipe (schema.proceed (PartialUser) ({ isActive: false }), expect).toEqual (
      result.succeed ({
        isActive: false,
      }),
    )
    pipe (
      schema.proceed (PartialUser) ({ id: 1, name: "John", isActive: false }),
      expect,
    ).toEqual (result.succeed ({ id: 1, name: "John", isActive: false }))
  })
})

describe ("required", () => {
  it ("should return struct with all required properties", () => {
    const PartialUser = pipe (User, schema.partial, schema.required)
    pipe (schema.validateUnknown (PartialUser) ({}), expect).toBe (false)
    pipe (
      schema.proceedUnknown (PartialUser) ({ name: "John", isActive: false }),
      expect,
    ).toEqual (result.fail (['property "id" is required']))
    pipe (
      schema.proceedUnknown (PartialUser) ({ isActive: false }),
      expect,
    ).toEqual (
      result.fail (['property "id" is required', 'property "name" is required']),
    )
    pipe (
      schema.proceed (PartialUser) ({ id: 1, name: "John", isActive: false }),
      expect,
    ).toEqual (result.succeed ({ id: 1, name: "John", isActive: false }))
  })
})

describe ("intersection", () => {
  it ("should return intersection of two schemas", () => {
    const User = schema.Struct ({
      id: schema.Number,
      name: schema.String,
    })
    const Status = schema.Struct ({
      enabled: schema.Boolean,
    })
    const UserWithStatus = pipe (User, schema.intersection (Status))
    pipe (schema.validateUnknown (UserWithStatus) (undefined), expect).toBe (false)
    pipe (
      schema.proceed (UserWithStatus) ({ id: 1, name: "John", enabled: true }),
      expect,
    ).toEqual (result.succeed ({ id: 1, name: "John", enabled: true }))
    pipe (
      schema.proceedUnknown (UserWithStatus) ({ id: 1, name: "John" }),
      expect,
    ).toEqual (result.fail (['property "enabled" is required']))
  })
})

describe ("intersection", () => {
  it ("should return intersection of two schemas", () => {
    const User = schema.Struct ({
      id: schema.Number,
      name: schema.String,
    })
    const Status = schema.Struct ({
      enabled: schema.Boolean,
    })
    const UserWithStatus = pipe (User, schema.intersection (Status))
    pipe (schema.validateUnknown (UserWithStatus) (undefined), expect).toBe (false)
    pipe (
      schema.proceed (UserWithStatus) ({ id: 1, name: "John", enabled: true }),
      expect,
    ).toEqual (result.succeed ({ id: 1, name: "John", enabled: true }))
    pipe (
      schema.proceedUnknown (UserWithStatus) ({ id: 1, name: "John" }),
      expect,
    ).toEqual (result.fail (['property "enabled" is required']))
  })
})
