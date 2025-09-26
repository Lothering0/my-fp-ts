import { option, array } from '../../../src'

describe('transformer', () => {
  it('should correctly transform `ReadonlyArray` monad', () => {
    const arrayOption = option.transform(array.Monad)

    expect(arrayOption.of(1)).toEqual<ReadonlyArray<option.Option<number>>>([
      {
        _id: 'Option',
        _tag: 'Some',
        value: 1,
      },
    ])

    expect(arrayOption.map(String)(arrayOption.of(1))).toEqual<
      ReadonlyArray<option.Option<string>>
    >([{ _id: 'Option', _tag: 'Some', value: '1' }])
  })

  it('should correctly compose multiple monads', () => {
    const arrayOption = option.transform(array.Monad)
    const arrayOptionOption = option.transform(arrayOption.Monad)

    expect(arrayOptionOption.of(1)).toEqual<
      ReadonlyArray<option.Option<option.Option<number>>>
    >([
      {
        _id: 'Option',
        _tag: 'Some',
        value: {
          _id: 'Option',
          _tag: 'Some',
          value: 1,
        },
      },
    ])

    expect(arrayOptionOption.map(String)(arrayOptionOption.of(1))).toEqual<
      ReadonlyArray<option.Option<option.Option<string>>>
    >([
      {
        _id: 'Option',
        _tag: 'Some',
        value: {
          _id: 'Option',
          _tag: 'Some',
          value: '1',
        },
      },
    ])
  })
})
