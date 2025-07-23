import * as T from "../../src/utils/typeChecks"

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
        expect (T.typeOf (x)).toBe (expected))
    })
  })

  interface TestCase {
    readonly f: (...args: ReadonlyArray<unknown>) => unknown
    /** `f` should return `true` if applied with one of these values */
    readonly values: ReadonlyArray<unknown>
  }

  const testCases: ReadonlyArray<TestCase> = [
    {
      f: T.isNumber,
      values: [typeByName.number],
    },
    {
      f: T.isBigint,
      values: [typeByName.bigint],
    },
    {
      f: T.isString,
      values: [typeByName.string],
    },
    {
      f: T.isBoolean,
      values: [typeByName.true, typeByName.false],
    },
    {
      f: T.isNullableObject,
      values: [typeByName.object, typeByName.array, typeByName.null],
    },
    {
      f: T.isObject,
      values: [typeByName.object, typeByName.array],
    },
    {
      f: T.isFunction,
      values: [typeByName.function],
    },
    {
      f: T.isNull,
      values: [typeByName.null],
    },
    {
      f: T.isUndefined,
      values: [typeByName.undefined],
    },
    {
      f: T.isSymbol,
      values: [typeByName.symbol],
    },
    {
      f: T.isDefined,
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
