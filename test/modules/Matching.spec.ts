import {
  Matching,
  Number,
  Option,
  pipe,
  Array,
  Result,
  Schema,
} from '../../src'

describe('Matching', () => {
  describe('getResult', () => {
    it('should return `failure` of unexpectned number', () => {
      const result = pipe(1, Matching.match, Matching.getResult)
      expect(result).toEqual<Result.Result<string, number>>(Result.fail(1))
    })

    it('should return `success` of first matching found', () => {
      const result = pipe(
        1,
        Matching.match,
        Matching.when(1, () => 'a'),
        Matching.when(1, () => 'b'),
        Matching.getResult,
      )
      expect<Result.Result<string, number>>(result).toEqual(Result.succeed('a'))
    })

    it('should return `success` of found matching', () => {
      const result = pipe(
        2,
        Matching.match,
        Matching.when(1, () => 'a'),
        Matching.when(2, () => 'b'),
        Matching.when(2, () => 'c'),
        Matching.getResult,
      )
      expect<Result.Result<string, number>>(result).toEqual(Result.succeed('b'))
    })
  })

  describe('getOption', () => {
    it('should return `none` of unexpectned number', () => {
      const result = pipe(1, Matching.match, Matching.getOption)
      expect<Option.Option<string>>(result).toEqual(Option.none)
    })

    it('should return `some` of first matching found', () => {
      const result = pipe(
        1,
        Matching.match,
        Matching.when(1, () => 'a'),
        Matching.when(1, () => 'b'),
        Matching.getOption,
      )
      expect<Option.Option<string>>(result).toEqual(Option.some('a'))
    })
  })

  describe('getOrElse', () => {
    it('should return default value', () => {
      const result = pipe(
        1,
        Matching.match,
        Matching.when(2, () => 'a'),
        Matching.when(3, () => 'b'),
        Matching.getOrElse(Number.show),
      )
      expect<string>(result).toEqual('1')
    })

    it('should return value of first matching found', () => {
      const result = pipe(
        1,
        Matching.match,
        Matching.when(1, () => 'a'),
        Matching.when(1, () => 'b'),
        Matching.getOrElse(() => 'c'),
      )
      expect<string>(result).toEqual('a')
    })
  })

  describe('getResults', () => {
    it('should return results of all checks', () => {
      const result = pipe(
        2,
        Matching.match,
        Matching.when(1, () => 'a'),
        Matching.when(2, () => 'b'),
        Matching.when(3, () => 'c'),
        Matching.getResults,
      )
      expect(result).toEqual([
        Result.fail(2),
        Result.succeed('b'),
        Result.fail(2),
      ])
    })
  })

  describe('getFailures', () => {
    it('should return failures of all checks', () => {
      const result = pipe(
        2,
        Matching.match,
        Matching.when(1, () => 'a'),
        Matching.when(2, () => 'b'),
        Matching.when(3, () => 'c'),
        Matching.getFailures,
      )
      expect<ReadonlyArray<number>>(result).toEqual([2, 2])
    })
  })

  describe('getSuccesses', () => {
    it('should return successes of all checks', () => {
      const result = pipe(
        2,
        Matching.match,
        Matching.when(1, () => 'a'),
        Matching.when(2, () => 'b'),
        Matching.when(2, () => 'c'),
        Matching.when(3, () => 'd'),
        Matching.getSuccesses,
      )
      expect<ReadonlyArray<string>>(result).toEqual(['b', 'c'])
    })
  })

  describe('getOptions', () => {
    it('should return options of all checks', () => {
      const result = pipe(
        2,
        Matching.match,
        Matching.when(1, () => 'a'),
        Matching.when(2, () => 'b'),
        Matching.when(3, () => 'c'),
        Matching.getOptions,
      )
      expect(result).toEqual([Option.none, Option.some('b'), Option.none])
    })
  })

  describe('getOrElseAll', () => {
    it('should return values of all checks', () => {
      const result = pipe(
        2,
        Matching.match,
        Matching.when(1, () => 'a'),
        Matching.when(2, () => 'b'),
        Matching.when(3, () => 'c'),
        Matching.getOrElseAll(() => 'e'),
      )
      expect<ReadonlyArray<string>>(result).toEqual(['e', 'b', 'e'])
    })
  })

  describe('on', () => {
    it('should return value of first matching found by predicate function', () => {
      const result = pipe(
        5,
        Matching.match,
        Matching.on(Number.lessThan(10), Number.show),
        Matching.on(Number.moreThan(0), () => 'a'),
        Matching.getResult,
      )
      expect(result).toEqual(Result.succeed('5'))
    })
  })

  describe('matchEquivalence', () => {
    it('should return value of first matching found by provided `Equivalence`', () => {
      const result = pipe(
        [1, 2, 3],
        Matching.matchEquivalence(Array.getEquivalence(Number.Equivalence)),
        Matching.when([], () => 'a'),
        Matching.when([1], () => 'b'),
        Matching.when([1, 2, 3, 4], () => 'c'),
        Matching.when([1, 2, 3], () => 'd'),
        Matching.when([1, 2, 3], () => 'e'),
        Matching.getResult,
      )
      expect(result).toEqual(Result.succeed('d'))
    })
  })

  describe('whenEquals', () => {
    it('should return value of first matching found by provided `Equivalence`', () => {
      const Equivalence = Array.getEquivalence(Number.Equivalence)
      const result = pipe(
        [1, 2, 3],
        Matching.match,
        Matching.whenEquals(Equivalence, [], () => 'a'),
        Matching.whenEquals(Equivalence, [1], () => 'b'),
        Matching.whenEquals(Equivalence, [1, 2, 3, 4], () => 'c'),
        Matching.when([1, 2, 3], () => 'd'),
        Matching.whenEquals(Equivalence, [1, 2, 3], () => 'e'),
        Matching.whenEquals(Equivalence, [1, 2, 3], () => 'f'),
        Matching.getResult,
      )
      expect(result).toEqual(Result.succeed('e'))
    })

    it('should pass matched value to callback', () => {
      const Equivalence = Array.getEquivalence(Number.Equivalence)
      const Show = Array.getShow(Number.Show)
      const result = pipe(
        [1, 2, 3],
        Matching.match,
        Matching.whenEquals(Equivalence, [1, 2, 3], Show.show),
        Matching.getResult,
      )
      expect(result).toEqual(Result.succeed('[1, 2, 3]'))
    })
  })

  describe('whenInstance', () => {
    it('should return value of first matching found by instanceof checking', () => {
      const result = pipe(
        new Error('a'),
        Matching.match<Error | ReadonlyArray<number>>,
        Matching.whenInstance(Array.Array, () => 1),
        Matching.whenInstance(Error, () => 2),
        Matching.whenInstance(Error, () => 3),
        Matching.getResult,
      )
      expect(result).toEqual(Result.succeed(2))
    })
  })

  describe('whenSchema', () => {
    it('should return value of first matching which processable by schema', () => {
      const result = pipe(
        1.5,
        Matching.match,
        Matching.whenSchema(Schema.Integer, () => 'a'),
        Matching.whenSchema(Schema.Never, () => 'b'),
        Matching.whenSchema(Schema.Number, () => 'c'),
        Matching.whenSchema(Schema.Any, () => 'd'),
        Matching.getResult,
      )
      expect(result).toEqual(Result.succeed('c'))
    })
  })
})
