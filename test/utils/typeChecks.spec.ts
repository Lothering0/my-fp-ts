import {
  isBigint,
  isBoolean,
  isDefined,
  isFunction,
  isNull,
  isNullable,
  isNullableObject,
  isNumber,
  isObject,
  isString,
  isSymbol,
  isUndefined,
  typeOf,
} from "../../src"

describe ("typeChecks", () => {
  const typeByName = {
    number: 1,
    bigint: 1n,
    string: "",
    true: true,
    false: false,
    null: null,
    function: () => 0,
    array: [],
    object: {},
    undefined: undefined,
    symbol: Symbol (),
  }

  describe ("typeOf", () => {
    Object.values (typeByName).forEach (x => {
      const expected = typeof x
      it (`should correctly determine \`${expected}\` type`, () =>
        expect (typeOf (x)).toBe (expected))
    })
  })

  interface TestCase {
    readonly f: (...args: ReadonlyArray<unknown>) => unknown
    /** `f` should return `true` if applied with one of these values */
    readonly values: ReadonlyArray<unknown>
  }

  const testCases: ReadonlyArray<TestCase> = [
    {
      f: isNumber,
      values: [typeByName.number],
    },
    {
      f: isBigint,
      values: [typeByName.bigint],
    },
    {
      f: isString,
      values: [typeByName.string],
    },
    {
      f: isBoolean,
      values: [typeByName.true, typeByName.false],
    },
    {
      f: isNullableObject,
      values: [typeByName.object, typeByName.array, typeByName.null],
    },
    {
      f: isObject,
      values: [typeByName.object, typeByName.array],
    },
    {
      f: isFunction,
      values: [typeByName.function],
    },
    {
      f: isNull,
      values: [typeByName.null],
    },
    {
      f: isNullable,
      values: [typeByName.undefined, typeByName.null],
    },
    {
      f: isUndefined,
      values: [typeByName.undefined],
    },
    {
      f: isSymbol,
      values: [typeByName.symbol],
    },
    {
      f: isDefined,
      values: Object.values (typeByName).filter (
        x => x !== null && x !== undefined,
      ),
    },
  ]

  testCases.forEach (({ f, values }) => {
    describe (f.name, () => {
      it.each (Object.entries (typeByName)) (
        "should correctly determine %p",
        (_, x) => {
          expect (f (x)).toBe (values.includes (x))
        },
      )
    })
  })
})
