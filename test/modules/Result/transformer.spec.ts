import { number, array, result } from '../../../src'

describe('transformer', () => {
  it('should correctly transform `ReadonlyArray` monad', () => {
    const arrayResult = result.transform(array.Monad)

    expect(arrayResult.succeed(1)).toEqual<
      ReadonlyArray<result.Result<string, number>>
    >([
      {
        _id: 'Result',
        _tag: 'Success',
        success: 1,
      },
    ])

    expect(arrayResult.fail('a')).toEqual<
      ReadonlyArray<result.Result<string, number>>
    >([
      {
        _id: 'Result',
        _tag: 'Failure',
        failure: 'a',
      },
    ])

    expect(arrayResult.map(number.show)(arrayResult.of(1))).toEqual<
      ReadonlyArray<result.Result<never, string>>
    >([{ _id: 'Result', _tag: 'Success', success: '1' }])
  })

  it('should correctly compose multiple monads', () => {
    const arrayResult = result.transform(array.Monad)
    const arrayResultResult = result.transform(arrayResult.Monad)

    expect(arrayResultResult.of(1)).toEqual<
      ReadonlyArray<result.Result<never, result.Result<never, number>>>
    >([
      {
        _id: 'Result',
        _tag: 'Success',
        success: { _id: 'Result', _tag: 'Success', success: 1 },
      },
    ])

    expect(arrayResultResult.map(String)(arrayResultResult.of(1))).toEqual<
      ReadonlyArray<result.Result<never, result.Result<never, string>>>
    >([
      {
        _id: 'Result',
        _tag: 'Success',
        success: {
          _id: 'Result',
          _tag: 'Success',
          success: '1',
        },
      },
    ])
  })
})
