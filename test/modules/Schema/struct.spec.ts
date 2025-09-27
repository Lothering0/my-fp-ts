import { pipe, Result, Schema } from '../../../src'

const User = Schema.Struct({
  id: Schema.PositiveInteger,
  name: pipe(Schema.String, Schema.minLength(2), Schema.maxLength(20)),
  isActive: Schema.Boolean,
})
type User = Schema.Type<typeof User>

describe('Struct', () => {
  it('should pass object that matches a struct', () => {
    const user: User = {
      id: 1,
      name: 'John',
      isActive: false,
    }

    pipe(Schema.proceed(User)(user), expect).toEqual(
      Result.succeed({
        id: 1,
        name: 'John',
        isActive: false,
      }),
    )
  })

  it('should not pass invalid values', () => {
    pipe(Schema.proceedUnknown(User)(undefined), expect).toEqual(
      Result.fail(['value `undefined` is not a struct']),
    )
    pipe(Schema.proceedUnknown(User)({}), expect).toEqual(
      Result.fail([
        'property "id" is required',
        'property "name" is required',
        'property "isActive" is required',
      ]),
    )
    pipe(
      Schema.proceedUnknown(User)({
        id: 1,
        name: 'John',
        isActive: false,
        createdAt: new Date(),
      }),
      expect,
    ).toEqual(Result.fail(['property "createdAt" should not exist']))
    pipe(
      Schema.proceedUnknown(User)({
        id: '1',
        name: 2,
        isActive: false,
      }),
      expect,
    ).toEqual(
      Result.fail([
        'on property "id": value "1" is not an integer',
        'on property "name": value `2` is not a string',
      ]),
    )
  })
})

describe('keyof', () => {
  it('should correctly extract keys of struct schema', () => {
    const Keys = Schema.keyof(User)
    pipe(Schema.proceedUnknown(Keys)(undefined), expect).toEqual(
      Result.fail([
        'got `undefined`, expected one of the following values: "id", "name", "isActive"',
      ]),
    )
    pipe(Schema.validateUnknown(Keys)(''), expect).toBe(false)
    pipe(Schema.validateUnknown(Keys)('a'), expect).toBe(false)
    pipe(Schema.proceed(Keys)('id'), expect).toEqual(Result.succeed('id'))
  })
})

const testUserWithoutId = (
  UserWithoutId: Schema.StructSchema<{
    name: Schema.Schema<string>
    isActive: Schema.Schema<boolean>
  }>,
) => {
  pipe(Schema.validateUnknown(UserWithoutId)(undefined), expect).toBe(false)
  pipe(
    Schema.proceed(UserWithoutId)({ name: 'John', isActive: true }),
    expect,
  ).toEqual(Result.succeed({ name: 'John', isActive: true }))
  pipe(
    Schema.proceedUnknown(UserWithoutId)({
      id: 1,
      name: 'John',
      isActive: true,
    }),
    expect,
  ).toEqual(Result.fail(['property "id" should not exist']))
}

describe('omit', () => {
  it('should return struct without provided keys', () => {
    const UserWithoutId = pipe(User, Schema.omit('id'))
    testUserWithoutId(UserWithoutId)
  })
})

describe('pick', () => {
  it('should return struct without provided keys', () => {
    const UserWithoutId = pipe(User, Schema.pick('name', 'isActive'))
    testUserWithoutId(UserWithoutId)
  })
})

describe('partial', () => {
  it('should return struct without required properties', () => {
    const PartialUser = pipe(User, Schema.partial)
    pipe(Schema.proceed(PartialUser)({}), expect).toEqual(Result.succeed({}))
    pipe(
      Schema.proceed(PartialUser)({ name: 'John', isActive: false }),
      expect,
    ).toEqual(Result.succeed({ name: 'John', isActive: false }))
    pipe(Schema.proceed(PartialUser)({ isActive: false }), expect).toEqual(
      Result.succeed({
        isActive: false,
      }),
    )
    pipe(
      Schema.proceed(PartialUser)({ id: 1, name: 'John', isActive: false }),
      expect,
    ).toEqual(Result.succeed({ id: 1, name: 'John', isActive: false }))
  })
})

describe('required', () => {
  it('should return struct with all required properties', () => {
    const PartialUser = pipe(User, Schema.partial, Schema.required)
    pipe(Schema.validateUnknown(PartialUser)({}), expect).toBe(false)
    pipe(
      Schema.proceedUnknown(PartialUser)({ name: 'John', isActive: false }),
      expect,
    ).toEqual(Result.fail(['property "id" is required']))
    pipe(
      Schema.proceedUnknown(PartialUser)({ isActive: false }),
      expect,
    ).toEqual(
      Result.fail(['property "id" is required', 'property "name" is required']),
    )
    pipe(
      Schema.proceed(PartialUser)({ id: 1, name: 'John', isActive: false }),
      expect,
    ).toEqual(Result.succeed({ id: 1, name: 'John', isActive: false }))
  })
})

describe('intersection', () => {
  it('should return intersection of two schemas', () => {
    const User = Schema.Struct({
      id: Schema.Number,
      name: Schema.String,
    })
    const Status = Schema.Struct({
      enabled: Schema.Boolean,
    })
    const UserWithStatus = pipe(User, Schema.intersection(Status))
    pipe(Schema.validateUnknown(UserWithStatus)(undefined), expect).toBe(false)
    pipe(
      Schema.proceed(UserWithStatus)({ id: 1, name: 'John', enabled: true }),
      expect,
    ).toEqual(Result.succeed({ id: 1, name: 'John', enabled: true }))
    pipe(
      Schema.proceedUnknown(UserWithStatus)({ id: 1, name: 'John' }),
      expect,
    ).toEqual(Result.fail(['property "enabled" is required']))
  })
})

describe('intersection', () => {
  it('should return intersection of two schemas', () => {
    const User = Schema.Struct({
      id: Schema.Number,
      name: Schema.String,
    })
    const Status = Schema.Struct({
      enabled: Schema.Boolean,
    })
    const UserWithStatus = pipe(User, Schema.intersection(Status))
    pipe(Schema.validateUnknown(UserWithStatus)(undefined), expect).toBe(false)
    pipe(
      Schema.proceed(UserWithStatus)({ id: 1, name: 'John', enabled: true }),
      expect,
    ).toEqual(Result.succeed({ id: 1, name: 'John', enabled: true }))
    pipe(
      Schema.proceedUnknown(UserWithStatus)({ id: 1, name: 'John' }),
      expect,
    ).toEqual(Result.fail(['property "enabled" is required']))
  })
})
