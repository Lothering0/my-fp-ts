import * as matching from "../../src/modules/Matching"
import * as result from "../../src/modules/Result"
import * as option from "../../src/modules/Option"
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
        matching.getOrElse (n => `c-${n}`),
      )
      expect<string> (result_).toEqual ("c-1")
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
})
