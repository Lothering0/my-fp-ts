import * as matching from "../../src/modules/Matching"
import * as result from "../../src/modules/Result"
import * as option from "../../src/modules/Option"
import * as readonlyArray from "../../src/modules/ReadonlyArray"
import * as number from "../../src/modules/Number"
import { pipe } from "../../src/utils/flow"

describe ("Matching", () => {
  describe ("getResult", () => {
    it ("should return `failure` of unexpectned number", () => {
      const result_ = pipe (1, matching.match, matching.getResult)
      expect (result_).toEqual<result.Result<number, string>> (result.fail (1))
    })

    it ("should return `success` of first found matching", () => {
      const result_ = pipe (
        1,
        matching.match,
        matching.when (1, () => "a"),
        matching.when (1, () => "b"),
        matching.getResult,
      )
      expect<result.Result<number, string>> (result_).toEqual (
        result.succeed ("a"),
      )
    })

    it ("should return `success` of found matching", () => {
      const result_ = pipe (
        2,
        matching.match,
        matching.when (1, () => "a"),
        matching.when (2, () => "b"),
        matching.when (2, () => "c"),
        matching.getResult,
      )
      expect<result.Result<number, string>> (result_).toEqual (
        result.succeed ("b"),
      )
    })
  })

  describe ("getOption", () => {
    it ("should return `none` of unexpectned number", () => {
      const result_ = pipe (1, matching.match, matching.getOption)
      expect<option.Option<string>> (result_).toEqual (option.none)
    })

    it ("should return `some` of first found matching", () => {
      const result_ = pipe (
        1,
        matching.match,
        matching.when (1, () => "a"),
        matching.when (1, () => "b"),
        matching.getOption,
      )
      expect<option.Option<string>> (result_).toEqual (option.some ("a"))
    })
  })

  describe ("getOrElse", () => {
    it ("should return default value", () => {
      const result_ = pipe (
        1,
        matching.match,
        matching.when (2, () => "a"),
        matching.when (3, () => "b"),
        matching.getOrElse (number.show),
      )
      expect<string> (result_).toEqual ("1")
    })

    it ("should return value of first found matching", () => {
      const result_ = pipe (
        1,
        matching.match,
        matching.when (1, () => "a"),
        matching.when (1, () => "b"),
        matching.getOrElse (() => "c"),
      )
      expect<string> (result_).toEqual ("a")
    })
  })

  describe ("on", () => {
    it ("should return value of first found instance by predicate function", () => {
      const result_ = pipe (
        5,
        matching.match,
        matching.on (number.lessThan (10), number.show),
        matching.on (number.moreThan (0), () => "a"),
        matching.getResult,
      )
      expect (result_).toEqual (result.succeed ("5"))
    })
  })

  describe ("matchEq", () => {
    it ("should return value of first found instance matching by provided `Eq`", () => {
      const result_ = pipe (
        [1, 2, 3],
        matching.matchEq (readonlyArray.getEq (number.Eq)),
        matching.when ([], () => "a"),
        matching.when ([1], () => "b"),
        matching.when ([1, 2, 3, 4], () => "c"),
        matching.when ([1, 2, 3], () => "d"),
        matching.when ([1, 2, 3], () => "e"),
        matching.getResult,
      )
      expect (result_).toEqual (result.succeed ("d"))
    })
  })

  describe ("whenEquals", () => {
    it ("should return value of first found instance matching by provided `Eq`", () => {
      const Eq = readonlyArray.getEq (number.Eq)
      const result_ = pipe (
        [1, 2, 3],
        matching.match,
        matching.whenEquals (Eq, [], () => "a"),
        matching.whenEquals (Eq, [1], () => "b"),
        matching.whenEquals (Eq, [1, 2, 3, 4], () => "c"),
        matching.when ([1, 2, 3], () => "d"),
        matching.whenEquals (Eq, [1, 2, 3], () => "e"),
        matching.whenEquals (Eq, [1, 2, 3], () => "f"),
        matching.getResult,
      )
      expect (result_).toEqual (result.succeed ("e"))
    })

    it ("should pass matched value to callback", () => {
      const Eq = readonlyArray.getEq (number.Eq)
      const Show = readonlyArray.getShow (number.Show)
      const result_ = pipe (
        [1, 2, 3],
        matching.match,
        matching.whenEquals (Eq, [1, 2, 3], Show.show),
        matching.getResult,
      )
      expect (result_).toEqual (result.succeed ("[1, 2, 3]"))
    })
  })
})
