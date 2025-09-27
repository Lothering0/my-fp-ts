import { pipe, Result, Schema } from '../../../src'

describe('Tuple', () => {
  it('it should correctly validate by schema of tuple without elements', () => {
    const Tuple = Schema.Tuple()
    pipe(Schema.validateUnknown(Tuple)(undefined), expect).toBe(false)
    pipe(Schema.proceed(Tuple)([]), expect).toEqual(Result.succeed([]))
    pipe(Schema.validateUnknown(Tuple)([1]), expect).toBe(false)
    pipe(Schema.validateUnknown(Tuple)([1, 'a']), expect).toBe(false)
    pipe(Schema.validateUnknown(Tuple)(['a', 'a']), expect).toBe(false)
    pipe(Schema.validateUnknown(Tuple)([1, 1]), expect).toBe(false)
  })

  it('it should correctly validate by schema of tuple with two elements', () => {
    const Tuple = Schema.Tuple(Schema.Number, Schema.String)
    pipe(Schema.validateUnknown(Tuple)(undefined), expect).toBe(false)
    pipe(Schema.validateUnknown(Tuple)([]), expect).toBe(false)
    pipe(Schema.validateUnknown(Tuple)([1]), expect).toBe(false)
    pipe(Schema.proceed(Tuple)([1, 'a']), expect).toEqual(
      Result.succeed([1, 'a']),
    )
  })

  it('it should correctly validate by schema of tuple with one required and one optional element', () => {
    const Tuple = Schema.Tuple(Schema.Number, Schema.optional(Schema.String))
    pipe(Schema.validateUnknown(Tuple)(undefined), expect).toBe(false)
    pipe(Schema.validateUnknown(Tuple)([]), expect).toBe(false)
    pipe(Schema.proceed(Tuple)([1]), expect).toEqual(Result.succeed([1]))
    pipe(Schema.proceed(Tuple)([1, 'a']), expect).toEqual(
      Result.succeed([1, 'a']),
    )
    pipe(Schema.validateUnknown(Tuple)([1, 1]), expect).toBe(false)
    pipe(Schema.proceed(Tuple)([1, undefined]), expect).toEqual(
      Result.succeed([1, undefined]),
    )
  })
})
