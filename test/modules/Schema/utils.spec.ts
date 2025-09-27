import { pipe, Result, Schema } from '../../../src'

describe('exact', () => {
  it('should check values by strict equivalence', () => {
    const Null = Schema.exact(null)
    pipe(Schema.proceed(Null)(null), expect).toEqual(Result.succeed(null))
    pipe(Schema.validateUnknown(Null)(undefined), expect).toBe(false)
  })
})

describe('lazy', () => {
  interface Recursive {
    readonly id: number
    readonly parent?: Recursive
  }

  const Recursive = Schema.Struct({
    id: Schema.Number,
    parent: pipe(
      Schema.lazy((): Schema.Schema<Recursive> => Recursive),
      Schema.optional,
    ),
  })

  it('should check value recursively', () => {
    pipe(Schema.proceed(Recursive)({ id: 1 }), expect).toEqual(
      Result.succeed({ id: 1 }),
    )
    pipe(Schema.validateUnknown(Recursive)({ id: 'a' }), expect).toBe(false)
    pipe(
      Schema.proceed(Recursive)({ id: 2, parent: { id: 1 } }),
      expect,
    ).toEqual(Result.succeed({ id: 2, parent: { id: 1 } }))
    pipe(
      Schema.validateUnknown(Recursive)({ id: 2, parent: { id: 'a' } }),
      expect,
    ).toBe(false)
    pipe(
      Schema.proceed(Recursive)({
        id: 3,
        parent: { id: 2, parent: { id: 1 } },
      }),
      expect,
    ).toEqual(
      Result.succeed({
        id: 3,
        parent: { id: 2, parent: { id: 1 } },
      }),
    )
    pipe(
      Schema.validateUnknown(Recursive)({
        id: 'a',
        parent: { id: 2, parent: { id: 1 } },
      }),
      expect,
    ).toBe(false)
    pipe(
      Schema.validateUnknown(Recursive)({
        id: 3,
        parent: { id: 'b', parent: { id: 1 } },
      }),
      expect,
    ).toBe(false)
    pipe(
      Schema.validateUnknown(Recursive)({
        id: 3,
        parent: { id: 2, parent: { id: 'c' } },
      }),
      expect,
    ).toBe(false)
  })
})

describe('instanceOf', () => {
  it('should correctly check is value an instance of a class', () => {
    const ErrorInstance = Schema.instanceOf(Error)
    pipe(Schema.validateUnknown(ErrorInstance)(undefined), expect).toBe(false)
    pipe(Schema.validateUnknown(ErrorInstance)([]), expect).toBe(false)
    pipe(Schema.validateUnknown(ErrorInstance)(Error), expect).toBe(false)
    pipe(Schema.validate(ErrorInstance)(new Error()), expect).toBe(true)
    pipe(Schema.validate(ErrorInstance)(new TypeError()), expect).toBe(true)
  })
})

describe('union', () => {
  it('should union two schemas', () => {
    const NumberOrString = pipe(Schema.Number, Schema.union(Schema.String))
    pipe(Schema.validateUnknown(NumberOrString)(undefined), expect).toBe(false)
    pipe(Schema.proceed(NumberOrString)('a'), expect).toEqual(
      Result.succeed('a'),
    )
    pipe(Schema.proceed(NumberOrString)(1), expect).toEqual(Result.succeed(1))
    pipe(Schema.validateUnknown(NumberOrString)(true), expect).toBe(false)
  })
})

describe('minLength', () => {
  it('should correctly validate length of a string', () => {
    const StringSchema = pipe(Schema.String, Schema.minLength(2))
    pipe(Schema.proceed(StringSchema)(''), expect).toEqual(
      Result.fail(['value length should not be less than 2, got 0']),
    )
    pipe(Schema.proceed(StringSchema)('a'), expect).toEqual(
      Result.fail(['value length should not be less than 2, got 1']),
    )
    pipe(Schema.proceed(StringSchema)('ab'), expect).toEqual(
      Result.succeed('ab'),
    )
    pipe(Schema.proceed(StringSchema)('abc'), expect).toEqual(
      Result.succeed('abc'),
    )
  })

  it('should correctly validate length of an array', () => {
    const ArraySchema = pipe(Schema.Number, Schema.Array, Schema.minLength(2))
    pipe(Schema.proceed(ArraySchema)([]), expect).toEqual(
      Result.fail(['value length should not be less than 2, got 0']),
    )
    pipe(Schema.proceed(ArraySchema)([1]), expect).toEqual(
      Result.fail(['value length should not be less than 2, got 1']),
    )
    pipe(Schema.proceed(ArraySchema)([1, 2]), expect).toEqual(
      Result.succeed([1, 2]),
    )
    pipe(Schema.proceed(ArraySchema)([1, 2, 3]), expect).toEqual(
      Result.succeed([1, 2, 3]),
    )
  })
})

describe('maxLength', () => {
  it('should correctly validate length of a string', () => {
    const StringSchema = pipe(Schema.String, Schema.maxLength(2))
    pipe(Schema.proceed(StringSchema)(''), expect).toEqual(Result.succeed(''))
    pipe(Schema.proceed(StringSchema)('a'), expect).toEqual(Result.succeed('a'))
    pipe(Schema.proceed(StringSchema)('ab'), expect).toEqual(
      Result.succeed('ab'),
    )
    pipe(Schema.proceed(StringSchema)('abc'), expect).toEqual(
      Result.fail(['value length should not be greater than 2, got 3']),
    )
  })

  it('should correctly validate length of an array', () => {
    const ArraySchema = pipe(Schema.Number, Schema.Array, Schema.maxLength(2))
    pipe(Schema.proceed(ArraySchema)([]), expect).toEqual(Result.succeed([]))
    pipe(Schema.proceed(ArraySchema)([1]), expect).toEqual(Result.succeed([1]))
    pipe(Schema.proceed(ArraySchema)([1, 2]), expect).toEqual(
      Result.succeed([1, 2]),
    )
    pipe(Schema.proceed(ArraySchema)([1, 2, 3]), expect).toEqual(
      Result.fail(['value length should not be greater than 2, got 3']),
    )
  })
})

describe('transformIn', () => {
  it('should transform value before it will be processed', () => {
    const ToNumber = pipe(Schema.Number, Schema.transformIn(Number))
    pipe(Schema.proceed(ToNumber)(1), expect).toEqual(Result.succeed(1))
    pipe(Schema.proceed(ToNumber)('1'), expect).toEqual(Result.succeed(1))
    pipe(Schema.proceed(ToNumber)(true), expect).toEqual(Result.succeed(1))
  })
})

describe('transformOut', () => {
  it('should transform value after it has been processed', () => {
    const StringifiedNumber = pipe(
      Schema.Number,
      Schema.union(Schema.String),
      Schema.transformOut(Number),
    )
    pipe(Schema.proceed(StringifiedNumber)(1), expect).toEqual(
      Result.succeed(1),
    )
    pipe(Schema.proceed(StringifiedNumber)('1'), expect).toEqual(
      Result.succeed(1),
    )
  })
})
