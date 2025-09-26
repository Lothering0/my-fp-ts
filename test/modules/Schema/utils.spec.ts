import { pipe, result, schema } from '../../../src'

describe('exact', () => {
  it('should check values by strict equivalence', () => {
    const Null = schema.exact(null)
    pipe(schema.proceed(Null)(null), expect).toEqual(result.succeed(null))
    pipe(schema.validateUnknown(Null)(undefined), expect).toBe(false)
  })
})

describe('lazy', () => {
  interface Recursive {
    readonly id: number
    readonly parent?: Recursive
  }

  const Recursive = schema.Struct({
    id: schema.Number,
    parent: pipe(
      schema.lazy((): schema.Schema<Recursive> => Recursive),
      schema.optional,
    ),
  })

  it('should check value recursively', () => {
    pipe(schema.proceed(Recursive)({ id: 1 }), expect).toEqual(
      result.succeed({ id: 1 }),
    )
    pipe(schema.validateUnknown(Recursive)({ id: 'a' }), expect).toBe(false)
    pipe(
      schema.proceed(Recursive)({ id: 2, parent: { id: 1 } }),
      expect,
    ).toEqual(result.succeed({ id: 2, parent: { id: 1 } }))
    pipe(
      schema.validateUnknown(Recursive)({ id: 2, parent: { id: 'a' } }),
      expect,
    ).toBe(false)
    pipe(
      schema.proceed(Recursive)({
        id: 3,
        parent: { id: 2, parent: { id: 1 } },
      }),
      expect,
    ).toEqual(
      result.succeed({
        id: 3,
        parent: { id: 2, parent: { id: 1 } },
      }),
    )
    pipe(
      schema.validateUnknown(Recursive)({
        id: 'a',
        parent: { id: 2, parent: { id: 1 } },
      }),
      expect,
    ).toBe(false)
    pipe(
      schema.validateUnknown(Recursive)({
        id: 3,
        parent: { id: 'b', parent: { id: 1 } },
      }),
      expect,
    ).toBe(false)
    pipe(
      schema.validateUnknown(Recursive)({
        id: 3,
        parent: { id: 2, parent: { id: 'c' } },
      }),
      expect,
    ).toBe(false)
  })
})

describe('instanceOf', () => {
  it('should correctly check is value an instance of a class', () => {
    const ErrorInstance = schema.instanceOf(Error)
    pipe(schema.validateUnknown(ErrorInstance)(undefined), expect).toBe(false)
    pipe(schema.validateUnknown(ErrorInstance)([]), expect).toBe(false)
    pipe(schema.validateUnknown(ErrorInstance)(Error), expect).toBe(false)
    pipe(schema.validate(ErrorInstance)(new Error()), expect).toBe(true)
    pipe(schema.validate(ErrorInstance)(new TypeError()), expect).toBe(true)
  })
})

describe('union', () => {
  it('should union two schemas', () => {
    const NumberOrString = pipe(schema.Number, schema.union(schema.String))
    pipe(schema.validateUnknown(NumberOrString)(undefined), expect).toBe(false)
    pipe(schema.proceed(NumberOrString)('a'), expect).toEqual(
      result.succeed('a'),
    )
    pipe(schema.proceed(NumberOrString)(1), expect).toEqual(result.succeed(1))
    pipe(schema.validateUnknown(NumberOrString)(true), expect).toBe(false)
  })
})

describe('minLength', () => {
  it('should correctly validate length of a string', () => {
    const StringSchema = pipe(schema.String, schema.minLength(2))
    pipe(schema.proceed(StringSchema)(''), expect).toEqual(
      result.fail(['value length should not be less than 2, got 0']),
    )
    pipe(schema.proceed(StringSchema)('a'), expect).toEqual(
      result.fail(['value length should not be less than 2, got 1']),
    )
    pipe(schema.proceed(StringSchema)('ab'), expect).toEqual(
      result.succeed('ab'),
    )
    pipe(schema.proceed(StringSchema)('abc'), expect).toEqual(
      result.succeed('abc'),
    )
  })

  it('should correctly validate length of an array', () => {
    const ArraySchema = pipe(schema.Number, schema.Array, schema.minLength(2))
    pipe(schema.proceed(ArraySchema)([]), expect).toEqual(
      result.fail(['value length should not be less than 2, got 0']),
    )
    pipe(schema.proceed(ArraySchema)([1]), expect).toEqual(
      result.fail(['value length should not be less than 2, got 1']),
    )
    pipe(schema.proceed(ArraySchema)([1, 2]), expect).toEqual(
      result.succeed([1, 2]),
    )
    pipe(schema.proceed(ArraySchema)([1, 2, 3]), expect).toEqual(
      result.succeed([1, 2, 3]),
    )
  })
})

describe('maxLength', () => {
  it('should correctly validate length of a string', () => {
    const StringSchema = pipe(schema.String, schema.maxLength(2))
    pipe(schema.proceed(StringSchema)(''), expect).toEqual(result.succeed(''))
    pipe(schema.proceed(StringSchema)('a'), expect).toEqual(result.succeed('a'))
    pipe(schema.proceed(StringSchema)('ab'), expect).toEqual(
      result.succeed('ab'),
    )
    pipe(schema.proceed(StringSchema)('abc'), expect).toEqual(
      result.fail(['value length should not be greater than 2, got 3']),
    )
  })

  it('should correctly validate length of an array', () => {
    const ArraySchema = pipe(schema.Number, schema.Array, schema.maxLength(2))
    pipe(schema.proceed(ArraySchema)([]), expect).toEqual(result.succeed([]))
    pipe(schema.proceed(ArraySchema)([1]), expect).toEqual(result.succeed([1]))
    pipe(schema.proceed(ArraySchema)([1, 2]), expect).toEqual(
      result.succeed([1, 2]),
    )
    pipe(schema.proceed(ArraySchema)([1, 2, 3]), expect).toEqual(
      result.fail(['value length should not be greater than 2, got 3']),
    )
  })
})

describe('transformIn', () => {
  it('should transform value before it will be processed', () => {
    const ToNumber = pipe(schema.Number, schema.transformIn(Number))
    pipe(schema.proceed(ToNumber)(1), expect).toEqual(result.succeed(1))
    pipe(schema.proceed(ToNumber)('1'), expect).toEqual(result.succeed(1))
    pipe(schema.proceed(ToNumber)(true), expect).toEqual(result.succeed(1))
  })
})

describe('transformOut', () => {
  it('should transform value after it has been processed', () => {
    const StringifiedNumber = pipe(
      schema.Number,
      schema.union(schema.String),
      schema.transformOut(Number),
    )
    pipe(schema.proceed(StringifiedNumber)(1), expect).toEqual(
      result.succeed(1),
    )
    pipe(schema.proceed(StringifiedNumber)('1'), expect).toEqual(
      result.succeed(1),
    )
  })
})
